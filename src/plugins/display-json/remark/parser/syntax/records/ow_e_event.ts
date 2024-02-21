import { DisplayJSONUnits } from '../../../../core/units';
import PrefixedArrow from '../../utils/prefix-arrow';

// eslint-disable-next-line prettier/prettier
export default class OverwolfElectronEventSubParser extends PrefixedArrow<
  DisplayJSONUnits._r_ow_e_event,
  DisplayJSONUnits._name_literal,
  DisplayJSONUnits._value
> {
  constructor() {
    super(
      'ow_e_event',
      DisplayJSONUnits._r_ow_e_event,
      DisplayJSONUnits._name_literal,
      DisplayJSONUnits._value,
    );
  }
}
