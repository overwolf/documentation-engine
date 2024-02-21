import { flow } from 'fp-ts/lib/function';
import { DisplayJSONUnits } from '../../../core/units';
import skip from '../../../../_base/fp-ts/skip';
import failParse from '../../../../_base/remark/fp-ts/fail-parse';
import SimpleSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DJNB } from '../../../core/node';

const failCallback = flow(
  failParse(true, 'This type should never be explicitly parsed as a unit!'),
);

class _FailSubParser extends SimpleSubParser<DisplayJSONUnits, DJNB, DJNB> {
  public StringifiedScheme = () => 'N/A';
  protected SetupLayerData = skip;
  protected CreateNode = failCallback;
  protected Starts = failCallback;
  protected Inner = failCallback;
  protected Ends = failCallback;
}

export default new _FailSubParser();
