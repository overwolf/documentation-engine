import * as E from 'fp-ts/lib/Either';
import { PD } from '../../data';
import { flow } from 'fp-ts/lib/function';
import biChain from '../../../../../_base/fp-ts/bi-chain';
import edit from '../../../../../_base/fp-ts/edit';
import skip from '../../../../../_base/fp-ts/skip';
import skipMap from '../../../../../_base/fp-ts/skip-map';
import useValue from '../../../../../_base/fp-ts/use-value';
import {
  EscapedSequence,
  EscapedSyntax,
} from '../../../../../_base/remark/escaping/sequence';
import { failReason } from '../../../../../_base/remark/fp-ts/fail-parse';
import SimpleSubParser from '../../../../../_base/remark/parsing/sub-parsers/sub-parser-simple';
import { DisplayJSONUnits } from '../../../../core/units';
import { DJNB, createDisplayJSONNode } from '../../../../core/node';
import syntaxContent from '../../../../../_base/fp-ts/syntax-content';

export type StringParseData = StringData;

export type StringData = {
  sequence: EscapedSequence<EscapedSyntax, any>;
};

export default class StringSubParser extends SimpleSubParser<
  DisplayJSONUnits,
  DJNB,
  DJNB<DisplayJSONUnits._v_string>
> {
  // eslint-disable-next-line prettier/prettier
  public StringifiedScheme = () => '\'StringValue\'';

  protected SetupLayerData = skip;

  protected CreateNode = (data: PD<StringParseData>) =>
    E.right(
      createDisplayJSONNode(
        DisplayJSONUnits._v_string,
        {
          sequence: data.layerData.sequence,
        },
        [],
      ),
    );

  protected Starts = useValue((data: PD<StringParseData>) =>
    flow(
      (d: PD<StringParseData>) => d.parser.current(),
      biChain(
        useValue((content) =>
          flow(
            syntaxContent(EscapedSyntax.String),
            E.map(
              edit(() => {
                data.layerData = {
                  sequence: content,
                };
                data.parser.consumeOne();
              }, data),
            ),
            E.mapLeft((error) => failReason(false, error)),
          ),
        ),
        (error) => E.left(failReason(true, error)),
      ),
    ),
  );

  protected Inner = skipMap;
  protected Ends = skipMap;
}
