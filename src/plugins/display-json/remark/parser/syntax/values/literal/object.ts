import { DisplayJSONUnits } from '../../../../../core/units';
import BracketsSubParser, { Brackets } from '../../../utils/brackets';

export default class ObjectSubParser extends BracketsSubParser<
  DisplayJSONUnits._object,
  DisplayJSONUnits._field
> {
  constructor(brackets: Brackets) {
    super(DisplayJSONUnits._object, DisplayJSONUnits._field, brackets);
  }
}
