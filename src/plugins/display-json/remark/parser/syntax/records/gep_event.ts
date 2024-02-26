import { DisplayJSONUnits } from '../../../../core/units';
import PrefixedArrow from '../../utils/prefix-arrow';

// eslint-disable-next-line prettier/prettier
export default class GEPEventSubParser extends PrefixedArrow<
  DisplayJSONUnits._r_gep_event,
  DisplayJSONUnits._name_literal,
  DisplayJSONUnits._value
> {
  constructor() {
    super(
      'gep_event',
      DisplayJSONUnits._r_gep_event,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._value,
    );
  }
}
