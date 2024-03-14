import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { NameLiteralParentConfig } from '../literal/name';
import { RequestedLinkPrefix } from '../../../type-linking';
import { PD } from '../../data';
import hasGeneric, { HasGenericData } from '../../utils/has-generic';
import skip from '../../../../../_base/fp-ts/skip';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';
import { DJPU } from '../../../../core/parse-unit';

export type LinkedParseData = LinkedData & HasGenericData;

export type LinkedData = {
  name: DJNB<DisplayJSONUnits._name_literal>;
};

export default class LinkedSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._v_linked>
> {
  public StringifiedScheme = () => 'LinkedName';

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<LinkedParseData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits._v_linked, {}, [
        data.layerData.generic,
        data.layerData.name,
      ]),
    );

  protected Starts = (data: PD<LinkedParseData>) =>
    flow(
      DJPU(DisplayJSONUnits._name_literal, {
        parentConfig: () =>
          ({
            allowNamespaceNames: true,
          } as NameLiteralParentConfig),
      }),
      E.map((name) => {
        // TODO: Check if we can make this only run in prod build somehow
        data.layerData.name = name;
        data.escapeHatch({
          key: RequestedLinkPrefix(name.data.hProperties.value),
          content: '',
        });
        return data;
      }),
    )(data);

  protected Inner = hasGeneric;
  protected Ends = skipMap;
}
