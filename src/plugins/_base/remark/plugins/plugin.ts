// This code is loosely based on https://github.com/facebook/docusaurus/blob/main/packages/docusaurus-mdx-loader/src/remark/admonitions/index.ts

import visit from 'unist-util-visit';
import type { Transformer, Processor, Plugin } from 'unified';
import type { Literal } from 'mdast';
import {
  BaseOptions,
  DEFAULT_ESCAPE,
  DEFAULT_BLOCK_TURN,
  LINE_SEPARATOR,
  DEFAULT_INLINE_TURN,
  DEFAULT_COMPONENT,
  DEFAULT_STRUCTURE,
} from './plugin-defaults';
import { createRemarkNode, RemarkNode } from '../../core/nodes';
import CommitEscapeHatches, {
  EscapeHatch,
  EscapeHatchEntry,
} from '../escape-hatch';
import normalize from '../../fp-ts/normalize';

export interface BasePluginOptions extends BaseOptions {
  openingTag: string;
  locateOpeningTag?: boolean;
  closingTag?: string;
  escapeString?: string;
  types?: readonly string[];
  includeOpening: boolean;
  includeClosing: boolean;
  parseContent: boolean;
}

export type PLUGIN_TYPE = {
  inline?: boolean;
  block?: boolean;
};

export type OpeningTagFactory<
  Options extends BasePluginOptions = BasePluginOptions,
> = {
  (options: Options, typesMatcher: string): RegExp;
};

export type ClosingTagFactory<
  Options extends BasePluginOptions = BasePluginOptions,
> = {
  (options: Options): RegExp;
};

export type DeEscapeOpening<
  Options extends BasePluginOptions = BasePluginOptions,
> = {
  (options: Options, escaped: string, tags: string): string;
};

export type DeEscapeClosing<
  Options extends BasePluginOptions = BasePluginOptions,
> = {
  (options: Options, escaped: string): string;
};

export type ContentTransform<
  Options extends BasePluginOptions = BasePluginOptions,
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
  Options extends BasePluginOptions = BasePluginOptions,
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

export function pluginFactory<Options extends BasePluginOptions, Content>(
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
    if (!options.pluginType.block && !options.pluginType.inline)
      throw new Error(`Plugin ${nodeType} is not registered for any parsing`);

    const types = (options?.types ?? []).join('|');
    const openingTag = openingTagFactory(options, types);
    const closingTag = closingTagFactory(options);

    /**
     * The tokenizer is called on content start,
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
    function tokenizer(this: any, eat: any, value: string, silent: boolean) {
      // Check the value for the opening tag's matcher (w/o start/end spaces)
      const openingMatch = openingTag.exec(value);

      // eslint-disable-next-line max-len
      // TODO: Verify if a silent run should ONLY return after locating a closing tag
      // Stop if no valid match is found / running in silent mode
      if (!openingMatch || openingMatch.index !== 0 || silent) {
        // This can also be written as (match && !silent)
        if (openingMatch && openingMatch.index !== 0)
          console.error(
            // eslint-disable-next-line max-len
            `Regex for ${nodeType} can match before its index! Matched as ${openingMatch}`,
          );
        // Return whether a valid match is found AND this is a silent run
        return openingMatch && openingMatch.index === 0 && silent;
      }

      // Mark the current location for potential recursive parsing
      const now = eat.now();

      // Consume lines until a closing tag
      let newValue = value;
      // Lines to potentially be marked as food if this component completes
      const potentialFood = [] as string[];
      // Content that will be further processed
      let content = [] as string[];
      // Whether or not a closing tag was found
      let success = false;
      // An anchor for the end of the opening match
      let firstMatchIndex = openingMatch.index + openingMatch[0].length;
      // While there is a next line (this will run at least once)
      do {
        // Locate the next newline starting at currentAnchor line
        const next = newValue.indexOf(LINE_SEPARATOR);
        // Obtain the string leading up to the closest newline / end of string
        let line = next > -1 ? newValue.slice(0, next + 1) : newValue;
        // Remove the line from newValue
        newValue = newValue.slice(line.length);

        const newFirstMatchIndex = Math.max(0, firstMatchIndex - line.length);

        const rawLine = line;

        // If we DON'T want to include the opening tag:
        if (!options.includeOpening) {
          // take a slice of the line after the remaining first match index
          line = line.slice(firstMatchIndex);
        }

        let closingMatch;
        // Check if the closing tag occurs in this trimmed line
        if (
          // eslint-disable-next-line no-cond-assign
          (closingMatch = closingTag.exec(rawLine.slice(firstMatchIndex)))
        ) {
          // Mark as success
          success = true;

          const consumedLine = rawLine.slice(
            0,
            firstMatchIndex + closingMatch.index + closingMatch[0].length,
          );
          line = rawLine.slice(
            !options.includeOpening ? firstMatchIndex : 0,
            firstMatchIndex +
              closingMatch.index +
              (options.includeClosing ? closingMatch[0].length : 0),
          );

          // Mark the line as scanned (do not eat it yet)
          potentialFood.push(consumedLine);

          line = line.trim();

          // Add the final line if it has any content left
          if (line) content.push(line);
          // Exit the loop
          break;
        }

        // Mark the line as scanned (do not eat it yet)
        potentialFood.push(rawLine);

        line = line.trim();
        // Add the content line if it has any content left
        if (line) content.push(line);
        // Ensure that the next line will not be considered the first
        firstMatchIndex = newFirstMatchIndex;
      } while (
        // Check if there is a next line
        newValue.length
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
				Starting at: ${openingMatch}
				Now: ${JSON.stringify(now, undefined, 4)}
				Raw file: ${JSON.stringify(content, undefined, 4)}
				`);
      }

      content = content.filter(Boolean).map((line) => {
        if (line === undefined) console.log(nodeType, value, content);
        // De-escape contained opening tags
        deEscapeOpening(options, line, types);
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
      const add = eat(potentialFood.join(''));

      // All child nodes of this tree
      let childNodes: RemarkNode<any>[] = [];
      // All properties of this node
      const properties = {
        rawContent: contentTransformResult?.content ?? content,
        extra: contentTransformResult?.extra ?? {},
      };

      // Re-parse the content in block mode (requires testing)
      if (options.pluginType.block && options.parseContent) {
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
          openingMatch,
          properties.extra,
          childNodes,
        ) ??
        createRemarkNode(nodeType, DEFAULT_STRUCTURE(nodeType, properties), [
          nodeType,
          properties,
          childNodes,
        ]);

      CommitEscapeHatches(options.escapeHatchPath ?? '', escapeHatch);

      // if (options.pluginType.inline && this.inBlock) {
      //   Only ran if this is running as inline
      // }

      return add(element);
    }

    if (options.pluginType.inline)
      tokenizer.locator = options.locateOpeningTag
        ? (value: string, fromIndex: number) =>
            value.indexOf(options.openingTag, fromIndex)
        : (value: string, fromIndex: number) => {
            // Based on https://stackoverflow.com/a/273810
            const indexInSuffix = value.slice(fromIndex).search(openingTag);
            return indexInSuffix < 0
              ? indexInSuffix
              : indexInSuffix + fromIndex;
          };

    // Get the current parser instance
    const Parser = this.Parser?.prototype;

    if (options.pluginType.block) {
      // Register this tokenizer for this node type
      Parser.blockTokenizers[nodeType] = tokenizer;
      // Add the current node type to the parser's parsing queue
      Parser.blockMethods.splice(
        // If parsePass is a number, add it at that point
        typeof parsePass === 'number'
          ? parsePass
          : // Otherwise, locate its index, and add this parser just afterwards
            Parser.blockMethods.indexOf(parsePass ?? DEFAULT_BLOCK_TURN) + 1,
        0,
        nodeType,
      );
    }

    if (options.pluginType.inline) {
      // Register this tokenizer for this node type
      Parser.inlineTokenizers[nodeType] = tokenizer;
      // Add the current node type to the parser's parsing queue
      Parser.inlineMethods.splice(
        // If parsePass is a number, add it at that point
        typeof parsePass === 'number'
          ? parsePass
          : // Otherwise, locate its index, and add this parser just afterwards
            Parser.inlineMethods.indexOf(parsePass ?? DEFAULT_INLINE_TURN) + 1,
        0,
        nodeType,
      );
    }

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
            node.value = deEscapeOpening(options, node.value, types);
            node.value = deEscapeClosing?.(options, node.value) ?? node.value;
          }
        },
      );
    };
  };
}

export default pluginFactory;
