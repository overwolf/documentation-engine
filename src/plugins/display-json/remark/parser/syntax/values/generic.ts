import { DisplayJSONUnits } from '../../../../core/units';
import BracketsSubParser, { Brackets } from '../../utils/brackets';

export default class GenericSubParser extends BracketsSubParser<
  DisplayJSONUnits._generic,
  DisplayJSONUnits._value
> {
  constructor(brackets: Brackets) {
    super(DisplayJSONUnits._generic, DisplayJSONUnits._value, brackets);
  }
}
