import { DisplayJSONUnits } from '../../../core/units';
import { NameLiteralParentConfig } from '../syntax/literal/name';
import ArrowSubParser, { ArrowParseData } from './arrow';
import { IsSequenceIn } from './sequences';

export default class PrefixedArrow<
  ResultType extends DisplayJSONUnits,
  LeftUnit extends DisplayJSONUnits,
  RightUnit extends DisplayJSONUnits,
> extends ArrowSubParser<ResultType, LeftUnit, RightUnit> {
  protected leftParentProperties = () =>
    ({
      allowNamespaceNames: true,
    } as NameLiteralParentConfig);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Typescript sometimes does not like this function
  protected PreStart = IsSequenceIn<ArrowParseData<LeftUnit, RightUnit>>(true, [
    this.stringifiedPrefix,
  ]);

  public StringifiedScheme(): string {
    return `${this.stringifiedPrefix} ${super.StringifiedScheme()}`;
  }

  constructor(
    private readonly stringifiedPrefix: string,
    resultType: ResultType,
    left: LeftUnit,
    right: RightUnit,
  ) {
    super(resultType, left, right);
  }
}
