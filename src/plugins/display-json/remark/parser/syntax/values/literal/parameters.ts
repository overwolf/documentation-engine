import { DisplayJSONUnits } from '../../../../../core/units';
import BracketsSubParser, { Brackets } from '../../../utils/brackets';

export default class ParametersSubParser extends BracketsSubParser<
  DisplayJSONUnits._parameters,
  DisplayJSONUnits._field
> {
  constructor(brackets: Brackets) {
    super(DisplayJSONUnits._parameters, DisplayJSONUnits._field, brackets);
  }
}
