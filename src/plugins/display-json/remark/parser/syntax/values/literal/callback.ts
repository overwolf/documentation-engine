import ArrowSubParser, { ArrowParseData } from '../../../utils/arrow';
import { CarryOverParserData } from '../../../utils/carry-over';
import { SequenceParseData } from '../../../utils/sequences';
import skipMap from '../../../../../../_base/fp-ts/skip-map';
import { DisplayJSONUnits } from '../../../../../core/units';
import { DJNB } from '../../../../../core/node';

export type CallbackParseData = ArrowParseData<
  DisplayJSONUnits._parameters,
  DisplayJSONUnits._value
> &
  CarryOverParserData & {
    preInnerCarry?: DJNB<DisplayJSONUnits._commented>[];
  } & SequenceParseData;

// eslint-disable-next-line prettier/prettier
export default class CallbackSubParser extends ArrowSubParser<
  DisplayJSONUnits._callback,
  DisplayJSONUnits._parameters,
  DisplayJSONUnits._value
> {
  protected PreStart = skipMap;

  constructor() {
    super(
      DisplayJSONUnits._callback,
      DisplayJSONUnits._parameters,
      DisplayJSONUnits._value,
    );
  }
}
