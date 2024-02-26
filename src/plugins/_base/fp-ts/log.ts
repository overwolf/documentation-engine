import edit from './edit';
import { inspect } from 'util';

export default <Data>(...messages: string[]) =>
  edit((d: Data) => console.log(...messages, inspect(d)));
