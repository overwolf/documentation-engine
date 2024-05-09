import { DisplayJSONUnits } from '../../../../../core/units';
import BracketsSubParser, { Brackets } from '../../../utils/brackets';

export default class GroupSubParser extends BracketsSubParser<
  DisplayJSONUnits._group,
  DisplayJSONUnits._value
> {
  constructor(brackets: Brackets) {
    super(DisplayJSONUnits._group, DisplayJSONUnits._value, brackets);
  }
}
