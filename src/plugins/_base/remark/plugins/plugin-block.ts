// This code is loosely based on https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-mdx-loader/src/remark/admonitions/index.ts

import visit from 'unist-util-visit';
import type { Transformer, Processor, Plugin } from 'unified';
import type { Literal } from 'mdast';
import {
  BaseOptions,
  DEFAULT_ESCAPE,
  DEFAULT_TURN,
  LINE_SEPARATOR,
} from './plugin-defaults';
import { createRemarkNode, RemarkNode } from '../../core/nodes';
import CommitEscapeHatches, {
  EscapeHatch,
  EscapeHatchEntry,
} from '../escape-hatch';
import normalize from '../../fp-ts/normalize';

export interface BaseBlockOptions extends BaseOptions {
  openingTag: string;
  closingTag?: string;
  escapeString?: string;
  types?: { [key: string]: any };
  includeOpening: boolean;
  includeClosing: boolean;
  parseContent: boolean;
}

export type OpeningTagFactory<
  Options extends BaseBlockOptions = BaseBlockOptions,
> = {
  (options: Options, typesMatcher: string): RegExp;
};

export type ClosingTagFactory<
  Options extends BaseBlockOptions = BaseBlockOptions,
> = {
  (options: Options): RegExp;
};

export type DeEscapeOpening<
  Options extends BaseBlockOptions = BaseBlockOptions,
> = {
  (options: Options, escaped: string): string;
};

export type DeEscapeClosing<
  Options extends BaseBlockOptions = BaseBlockOptions,
> = {
  (options: Options, escaped: string): string;
};

export type ContentTransform<
  Options extends BaseBlockOptions = BaseBlockOptions,
  Content = string,
  Extra extends object = any,
> = {
  (
    options: Options,
    content: string[],
    registerEscapeHatch: (...entries: EscapeHatchEntry[]) => void,
  ): {
    content: Content[];
    extra: Extra;
  };
};

export type CreateContentNode<
  Options extends BaseBlockOptions = BaseBlockOptions,
  Content = string,
  Extra extends object = any,
> = {
  (
    options: Options,
    content: Content[],
    registerEscapeHatch: (...entries: EscapeHatchEntry[]) => void,
    matchGroups: string[],
    extra: Extra,
    childNodes?: RemarkNode<any>[],
  ): RemarkNode<any, any>;
};

export function pluginFactory<Options extends BaseBlockOptions, Content>(
  nodeType: string,
  defaultOptions: Options,
  openingTagFactory: OpeningTagFactory<Options>,
  closingTagFactory: ClosingTagFactory<Options>,
  deEscapeOpening: DeEscapeOpening<Options>,
  deEscapeClosing?: DeEscapeClosing<Options>,
  contentTransform?: ContentTransform<Options, Content, any>,
  CreateContentNode?:
    | CreateContentNode<Options, Content>
    | CreateContentNode<Options, string>,
  parsePass?: string | number,
): Plugin {
  // If no escape string is defined, use the default one
  defaultOptions.escapeString = defaultOptions.escapeString ?? DEFAULT_ESCAPE;

  return function plugin(
    this: Processor,
    optionsInput: Partial<Options> = {},
  ): Transformer {
    const options = normalize(defaultOptions)(optionsInput);
    const types = Object.keys(options?.types ?? []).join('|');
    const openingTag = openingTagFactory(options, types);
    const closingTag = closingTagFactory(options);

    /**
     * The tokenizer is called on a content block's start,
     * to determine if its node exists within it
     *
     * If the node does exist, it parses it,
     * re-evaluating the content if necessary
     *
     * @param this
     * @param eat
     * @param value
     * @param silent
     * @returns
     */
    function blockTokenizer(
      this: any,
      eat: any,
      value: string,
      silent: boolean,
    ) {
      // Check the value for the opening tag's matcher (w/o start/end spaces)
      const match = openingTag.exec(value.trim());
      // eslint-disable-next-line max-len
      // TODO: Verify if a silent run should ONLY return after locating a closing tag
      // Stop if no match is found / running in silent mode
      if (!match || silent) {
        // Return whether match is found AND this is a silent run
        return match && silent;
      }

      // Mark the current location
      const now = eat.now();
      // Extract the different match groups from the opening tag
      const matchGroups = match as string[];

      // Consume lines until a closing tag
      let newValue = value;
      // Lines to potentially be marked as food if this component completes
      const potentialFood = [] as string[];
      // Content that will be further processed
      let content = [] as string[];
      // Whether or not a closing tag was found
      let success = false;
      // The current anchor for line splitting
      let currentAnchor = -1;
      // While there is a next line (this will run at least once)
      do {
        // Locate the next newline starting at currentAnchor line
        const next = newValue.indexOf(LINE_SEPARATOR, currentAnchor + 1);
        // Obtain the string leading up to the closest newline / end of string
        const line =
          next > -1
            ? newValue.slice(currentAnchor + 1, next)
            : newValue.slice(currentAnchor + 1);
        // Mark the line as scanned (do not eat it yet)
        potentialFood.push(line);
        // Remove the line from newValue
        newValue = newValue.slice(currentAnchor + 1);
        // Trim all spaces from the current line
        let contentLine = line.trim();
        // Check if the closing tag occurs in this trimmed line
        if (closingTag.exec(contentLine)) {
          // Mark as success
          success = true;
          // If we should include the closing tag, we add it to the content
          if (!options.includeClosing) {
            // If we don't want to, remove the closing tag from the line
            contentLine = contentLine.replace(closingTag, '');
          }

          // Add the final line if it has any content left
          if (contentLine) content.push(contentLine);
          // Exit the loop
          break;
        }

        // If we DON'T want to include the opening tag:
        // check if the current anchor is the start of the text
        if (!options.includeOpening && currentAnchor === -1) {
          // If it is, remove the opening tag from the text
          contentLine = contentLine.replace(openingTag, '');
        }

        // Add the content line if it has any content left
        if (contentLine) content.push(contentLine);
        // Advance the anchor
        currentAnchor = newValue.indexOf(LINE_SEPARATOR);
      } while (
        // Check if there is a next line
        currentAnchor !== -1
      );

      /* We throw an error if the block couldn't close, since it means:
       * - An explicit, un-escaped call for the node occured
       * - And it wasn't closed
       *
       * Meaning - there is probably something going wrong,
       * and it's better to prevent the build than silently keep it in.
       */
      if (!success) {
        throw new Error(`
				${nodeType} Was started, but was never closed!
				Closing regex: ${closingTag.source} ${closingTag}
				Starting at: ${match}
				Now: ${JSON.stringify(now, undefined, 4)}
				Raw file: ${JSON.stringify(content, undefined, 4)}
				`);
      }

      content = content.map((line) => {
        // De-escape contained opening tags
        deEscapeOpening(options, line);
        // De-escape contained closing tags if desired
        line = deEscapeClosing?.(options, line) ?? line;
        // Return the new line
        return line;
      });

      const escapeHatch: EscapeHatchEntry[] = [];
      const registerEscapeHatchEntries: EscapeHatch = (
        ...entries: EscapeHatchEntry[]
      ) => escapeHatch.push(...entries);

      // Allow the plugin to further transform the content directly
      const contentTransformResult = contentTransform?.(
        options,
        content,
        registerEscapeHatchEntries,
      );

      // Consume the parsed text
      const add = eat(potentialFood.join(LINE_SEPARATOR));

      // All child nodes of this tree
      let childNodes: RemarkNode<any>[] = [];
      // All properties of this node
      const properties = {
        rawContent: contentTransformResult?.content ?? content,
        extra: contentTransformResult?.extra ?? {},
      };
      // Re-parse the content in block mode
      if (options.parseContent) {
        // Begin a block
        const exit = this.enterBlock();
        // Parse content string
        childNodes = this.tokenizeBlock(content.join(LINE_SEPARATOR), now);
        // Exit block
        exit();
      }

      // The final tree node
      const element =
        CreateContentNode?.(
          options,
          properties.rawContent as any[],
          registerEscapeHatchEntries,
          matchGroups,
          properties.extra,
          childNodes,
        ) ?? createRemarkNode(nodeType, {}, [nodeType, properties, childNodes]);

      CommitEscapeHatches(options.escapeHatchPath ?? '', escapeHatch);
      return add(element);
    }

    // Get the current parser instance
    const Parser = this.Parser?.prototype;
    // Register this tokenizer for this node type
    Parser.blockTokenizers[nodeType] = blockTokenizer;
    // Add the current node type to the parser's parsing queue
    Parser.blockMethods.splice(
      // If parsePass is a number, add it at that point
      typeof parsePass === 'number'
        ? parsePass
        : // Otherwise, locate its index, and add this parser just afterwards
          Parser.blockMethods.indexOf(parsePass ?? DEFAULT_TURN) + 1,
      0,
      nodeType,
    );

    // Return a de-escaping transformer,
    // to de-escape escaped syntax of this tag inside of any other node type
    return (root) => {
      visit(
        // Visit the given root
        root,
        // Ensure for every node that it is NOT of the current type
        (node: unknown): node is Literal =>
          (node as Literal | undefined)?.type !== nodeType,
        (node: Literal) => {
          // If  it has a value, de-escape all relevant syntax of this node
          if (node.value) {
            node.value = deEscapeOpening(options, node.value);
            node.value = deEscapeClosing?.(options, node.value) ?? node.value;
          }
        },
      );
    };
  };
}

export default pluginFactory;
