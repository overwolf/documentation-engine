import { EscapedSequence, EscapedSyntax } from '../remark/escaping/sequence';

export default (content: EscapedSequence<EscapedSyntax, any>) =>
  content.content;
