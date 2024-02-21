import * as E from 'fp-ts/Either';
import ContentHandlerEscaped from './content-handler';

export type EscapedSequence<Syntax, Sequence> = {
  syntax: Syntax;
  start: Sequence;
  content: string;
  end: Sequence | string;
  linePrefix?: string;
  indent?: number;
};

export type SequenceHandler<Syntax = EscapedSyntax, Sequence = any> = {
  start: Sequence;
  handleEscape: (
    startIndex: number,
  ) => (content: ContentHandlerEscaped<Syntax>) => E.Either<string, void>;
};

export const enum EscapedSyntax {
  Comment = 'comment',
  String = 'string',
  Literal = 'literal',
}

export const StringToLiteral = (
  content: string,
): EscapedSequence<EscapedSyntax, any> => ({
  start: undefined,
  end: undefined,
  content,
  syntax: EscapedSyntax.Literal,
});
