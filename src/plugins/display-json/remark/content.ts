import { ContentTransform } from '../../_base/remark/plugins/plugin';
import {
  stringToRegex,
  stringsToRegex,
} from '../../_base/utils/string-to-regex';
import syntaxSplit from './fp-ts/syntax-split';
import { DisplayJSONNode } from '../types/display-json-node';
import { DisplayJSONOptions } from './options';
import {
  EscapedSyntax,
  SequenceHandler,
  StringToLiteral,
} from '../../_base/remark/escaping/sequence';
import { Content } from './parser/parser';
import { flow } from 'fp-ts/lib/function';
import ContentHandlerEscaped from '../../_base/remark/escaping/content-handler';
import * as E from 'fp-ts/Either';
import useValue from '../../_base/fp-ts/use-value';
import edit from '../../_base/fp-ts/edit';
import syntaxContent from '../../_base/fp-ts/syntax-content';
import biChain from '../../_base/fp-ts/bi-chain';

// Where we would transform the
export const transformContent: ContentTransform<DisplayJSONOptions, Content> = (
  options: DisplayJSONOptions,
  content: string[],
): DisplayJSONNode => {
  // console.log(contentHandler, contentHandler.currentIndex());
  return {
    extra: {},
    content:
      /** A flat `string[]` of all "safe to use" strings */
      flow(
        edit(escapeContent(options)),
        (handler: ContentHandlerEscaped) => handler.getEscapedContent(),
        syntaxSplit(/\s+/, true),
        syntaxSplit(',', true),
        syntaxSplit(';', true),
        syntaxSplit(
          [
            ...stringsToRegex(':', '=>', '=', '?'),
            ...options.blocks.flatMap((bracket) => {
              return [
                stringToRegex(bracket.openingTag),
                stringToRegex(bracket.closingTag),
              ];
            }),
          ].join('|'),
        ),
        (content) =>
          content.filter(
            flow(
              syntaxContent(EscapedSyntax.Literal),
              biChain(
                (content) => content !== '',
                () => true,
              ),
            ),
          ),
      )(new ContentHandlerEscaped(content.map(StringToLiteral))),
  };
};

type IndexedEscape = SequenceHandler<EscapedSyntax, any> & { index: number };

const findEscapeSequence =
  (options: DisplayJSONOptions) =>
  (currentLine: string): IndexedEscape => {
    return [...options.escapeSequences]
      .map((value) => {
        const cast = value as IndexedEscape;
        cast.index = currentLine.indexOf(value.start);
        return cast;
      })
      .sort(({ index: a }, { index: b }) => {
        // eslint-disable-next-line no-nested-ternary, prettier/prettier
        return a === -1 ? 1 : (b === -1 ? -1 : a - b);
      })[0];
  };

const escapeContent = (options: DisplayJSONOptions): any =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useValue<ContentHandlerEscaped, E.Either<any, any>>(
    (content: ContentHandlerEscaped) =>
      flow(
        () => content.current(),
        E.chain(
          flow(
            syntaxContent(EscapedSyntax.Literal),
            E.map(
              flow(
                findEscapeSequence(options),
                E.fromPredicate(
                  (escape) => escape.index !== -1,
                  flow(() => content.consumeOne(), E.isLeft),
                ),
                E.bimap(
                  E.fromPredicate(
                    // If out of content, stop
                    (outOfContent) => outOfContent,
                    // Otherwise, continue parsing
                    () => escapeContent(options)(content),
                  ),
                  (escape) =>
                    flow(
                      () => content,
                      edit((content) =>
                        escape.handleEscape(escape.index)(content),
                      ),
                      escapeContent(options),
                    )(),
                ),
              ),
            ),
          ),
        ),
      ),
  );
