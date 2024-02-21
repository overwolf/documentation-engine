import { DisplayJSONUnits } from '../../../../../core/units';
import BracketsSubParser, { Brackets } from '../../../utils/brackets';

export default class ArraySubParser extends BracketsSubParser<
  DisplayJSONUnits._array,
  DisplayJSONUnits._value
> {
  constructor(brackets: Brackets) {
    super(DisplayJSONUnits._array, DisplayJSONUnits._value, brackets);
  }
}
