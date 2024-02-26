import { DisplayJSONUnits } from '../../core/units';
import DisplayJSONParser from './parser';
import { ParserData } from '../../../_base/remark/parsing/data';
import { DJNB } from '../../core/node';

export type PD<
  LayerData = { [key: string]: any },
  ParentData = { [key: string]: any },
> = ParserData<
  DisplayJSONUnits,
  DJNB,
  LayerData,
  any,
  DisplayJSONParser,
  ParentData
>;
