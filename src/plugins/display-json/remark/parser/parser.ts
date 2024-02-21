import CallbackSubParser from './syntax/values/literal/callback';
import { DisplayJSONUnits } from '../../core/units';
import GenericSubParser from './syntax/values/generic';
import FieldSubParser from './syntax/field';
import NameLiteralSubParser from './syntax/literal/name';
import NameSubParser from './syntax/name';
import VarSubParser from './syntax/records/var';
import OverwolfPlatformEventSubParser from './syntax/records/ow_p_event';
import OverwolfElectronEventSubParser from './syntax/records/ow_e_event';
import GEPInfoSubParser from './syntax/records/gep_info';
import GEPEventSubParser from './syntax/records/gep_event';
import FunctionSubParser from './syntax/records/function';
import RecordSubParser from './syntax/record';
import ValueSubParser from './syntax/value';
import PrimitiveSubParser from './syntax/values/primitive';
import BaseParser, { ParserUnits } from '../../../_base/remark/parsing/parser';
import StringSubParser from './syntax/values/string';
import LinkedSubParser from './syntax/values/linked';
import LiteralSubParser from './syntax/values/literal';
import { DisplayJSONOptions, BracketTypes, BlockDefinition } from '../options';
import ArraySubParser from './syntax/values/literal/array';
import ObjectSubParser from './syntax/values/literal/object';
import ParametersSubParser from './syntax/values/literal/parameters';
import CommentSubParser from './syntax/comment';
import {
  EscapedSequence,
  EscapedSyntax,
} from '../../../_base/remark/escaping/sequence';
import RootSubParser from './syntax/root';
import escapedContent from '../../../_base/fp-ts/escaped-content';
import { DJNB } from '../../core/node';
import AssignmentSubParser from './syntax/assignment';

export type Content = EscapedSequence<EscapedSyntax, EscapeSequences>;

export type EscapeSequences =
  DisplayJSONOptions['escapeSequences'][number]['start'];

export default class DisplayJSONParser extends BaseParser<
  DisplayJSONUnits,
  DJNB,
  Content
> {
  public contentAsString(
    content: EscapedSequence<EscapedSyntax, string>,
  ): string {
    return escapedContent(content);
  }

  protected _getDefaultParsers(
    options: DisplayJSONOptions,
  ): ParserUnits<DisplayJSONUnits, DJNB> {
    return {
      [DisplayJSONUnits._root]: [new RootSubParser()],
      [DisplayJSONUnits._s_assignment]: [new AssignmentSubParser()],
      [DisplayJSONUnits._parameters]: [
        new ParametersSubParser(FormatBrackets('Params', options.blocks)),
      ],
      [DisplayJSONUnits._generic]: [
        new GenericSubParser(FormatBrackets('Generic', options.blocks)),
      ],
      [DisplayJSONUnits._field]: [new FieldSubParser()],
      [DisplayJSONUnits._value]: [new ValueSubParser(options.values)],
      [DisplayJSONUnits._record]: [new RecordSubParser(options.records)],
      [DisplayJSONUnits.KeepLiteral]: [],
      [DisplayJSONUnits.Skip]: [],
      [DisplayJSONUnits.Comment]: [new CommentSubParser()],
      [DisplayJSONUnits.Name]: [new NameSubParser()],
      [DisplayJSONUnits._name_literal]: [new NameLiteralSubParser()],

      // Values
      [DisplayJSONUnits._v_string]: [new StringSubParser()],
      [DisplayJSONUnits._v_linked]: [new LinkedSubParser()],
      [DisplayJSONUnits._v_literal]: [new LiteralSubParser()],
      [DisplayJSONUnits._v_primitive]: [
        new PrimitiveSubParser(options.primitives),
      ],

      // Literals
      /* Failure alowed */ _union: [],
      [DisplayJSONUnits._array]: [
        new ArraySubParser(FormatBrackets('Array', options.blocks)),
      ],
      [DisplayJSONUnits._object]: [
        new ObjectSubParser(FormatBrackets('Object', options.blocks)),
      ],
      [DisplayJSONUnits._callback]: [new CallbackSubParser()],

      // Records
      [DisplayJSONUnits._r_function]: [new FunctionSubParser()],
      [DisplayJSONUnits._r_gep_event]: [new GEPEventSubParser()],
      [DisplayJSONUnits._r_gep_info]: [new GEPInfoSubParser()],
      [DisplayJSONUnits._r_ow_p_event]: [new OverwolfPlatformEventSubParser()],
      [DisplayJSONUnits._r_ow_e_event]: [new OverwolfElectronEventSubParser()],
      [DisplayJSONUnits._r_variable]: [new VarSubParser()],

      [DisplayJSONUnits._commented]: [],
    } as Required<ParserUnits<DisplayJSONUnits, DJNB>>;
  }

  // public ParseUnit: <ParsedUnit extends DisplayJSONUnit>(
  //   unitType: ParsedUnit,
  // ) => (data: PD) => E.Either<FailureReason, DJNB<ParsedUnit>>;
}

function FormatBrackets(type: BracketTypes, brackets: BlockDefinition[]) {
  return brackets
    .filter((def) => def.blockType === type)
    .reduce(
      (prev, def) => ({
        ...prev,
        [def.openingTag]: def.closingTag,
      }),
      {} as { [key: string]: string },
    );
}
