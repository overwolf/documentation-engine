import { EscapedSyntax } from '../sequence';
import multiLine from './multi-line';

export default multiLine(EscapedSyntax.String, '"');
