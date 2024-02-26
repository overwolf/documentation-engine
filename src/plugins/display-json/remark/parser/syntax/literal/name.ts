// Parse a valid field name

import * as E from 'fp-ts/lib/Either';
import { PD } from '../../data';
import { SequenceParseData, DoesSequenceMatch } from '../../utils/sequences';
import edit from '../../../../../_base/fp-ts/edit';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import useValue from '../../../../../_base/fp-ts/use-value';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';

export type NameLiteralParseData = SequenceParseData & NameLiteralParentConfig;

export type NameLiteralParentConfig = {
  allowNamespaceNames?: boolean;
};

export default class NameLiteralSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._name_literal>
> {
  public StringifiedScheme = () =>
    // eslint-disable-next-line max-len
    'AllowNamespaceNames\n  ? /^(?:[a-zA-Z0-9_])+(?:.[a-zA-Z0-9_]+)*$/\n  : /^(?:[a-zA-Z0-9_])+$/';

  protected SetupLayerData = edit(
    (data: PD<NameLiteralParseData>) =>
      (data.layerData.allowNamespaceNames =
        data.layerData.allowNamespaceNames ?? false),
  );

  protected CreateNode = (data: PD<NameLiteralParseData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._name_literal,
        {
          value: data.layerData.lastContent,
        },
        [],
      ),
    );

  protected Starts = useValue((data: PD<NameLiteralParseData>) =>
    DoesSequenceMatch(
      true,
      data.layerData.allowNamespaceNames
        ? /^(?:[a-zA-Z0-9_])+(?:\.[a-zA-Z0-9_]+)*$/
        : /^(?:[a-zA-Z0-9_])+$/,
    ),
  );

  protected Inner = skipMap;
  protected Ends = skipMap;
}
