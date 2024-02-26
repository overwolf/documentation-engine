import edit from '../../fp-ts/edit';
import { ParserData } from '../parsing/data';

export default edit(
  (data: ParserData<any, any>) => (data.parentConfig = data.layerData),
);

export const chainParentConfig = (data: ParserData<any, any>) => data.layerData;
