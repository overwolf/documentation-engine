import { EscapedSyntax } from '../sequence';
import multiLine from './multi-line';

const commentBlock = (opening: string) =>
  multiLine(EscapedSyntax.Comment, opening, '*/', /(\*\/)/g, '* ', 1);

export const commentBlockRich = commentBlock('/**');
export default commentBlock('/*');
