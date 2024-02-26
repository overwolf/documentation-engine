import * as E from 'fp-ts/lib/Either';
import { flow } from 'fp-ts/lib/function';
import { NameLiteralParentConfig } from './literal/name';
import { DisplayJSONUnits } from '../../../core/units';
import { PD } from '../data';
import edit from '../../../../_base/fp-ts/edit';
import skipMap from '../../../../_base/fp-ts/skip-map';
import firstInChain from '../../../../_base/remark/fp-ts/first-in-chain';
import passParentConfig from '../../../../_base/remark/fp-ts/pass-parent-config';
import SimpleSubParser from '../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DJNB, createDisplayJSONNode } from '../../../core/node';

export type NameParseData = NameParentConfig & {
  content: AllowedChildren;
} & NameData;

type AllowedChildren =
  | DJNB<DisplayJSONUnits._name_literal>
  | DJNB<DisplayJSONUnits._v_string>;

export type NameData = { value: string };

export type NameParentConfig = {
  enableStringName: boolean;
} & NameLiteralParentConfig;

export default class NameSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits.Name>
> {
  // eslint-disable-next-line prettier/prettier
  public StringifiedScheme = () => '\'StringName\' | LiteralName';

  protected SetupLayerData = flow(
    edit(
      (data: PD<NameParseData>) =>
        (data.layerData.enableStringName =
          data.layerData.enableStringName ?? true),
    ),
    passParentConfig,
  );

  protected CreateNode = (data: PD<NameParseData>) =>
    E.right(
      createDisplayJSONNode(DisplayJSONUnits.Name, {}, [
        data.layerData.content,
      ]),
    );

  protected Starts = (data: PD<NameParseData>) =>
    flow(
      firstInChain<DisplayJSONUnits, AllowedChildren>([
        [DisplayJSONUnits._v_string, data.layerData.enableStringName],
        DisplayJSONUnits._name_literal,
      ]),
      E.map((resultNode: AllowedChildren) => {
        data.layerData.content = resultNode;
        return data;
      }),
      // @ts-expect-error Typescript does not like this specific type
    )(data);

  protected Inner = skipMap;
  protected Ends = skipMap;
}
