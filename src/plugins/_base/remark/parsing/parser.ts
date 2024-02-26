import { flow } from 'fp-ts/lib/function';
import BaseSubParser, { FailureReason } from './sub-parsers/sub-parser';
import * as E from 'fp-ts/lib/Either';
import tryParse, { setUpData } from '../fp-ts/try-parse';
import biChain from '../../fp-ts/bi-chain';
import { failReason } from '../fp-ts/fail-parse';
import skip from '../../fp-ts/skip';
import {
  ParseTree,
  ParseTreeStepParseUnit,
  ParseTreeStepParser,
  ParseTreeStepUnwind as ParseTreeStepRewind,
} from './praser-tree';
import edit from '../../fp-ts/edit';
import runIf from '../../fp-ts/run-if';
import { RemarkNode } from '../../core/nodes';
import { ParserData } from './data';
import ContentHandler from '../../utils/content-handler';
import { EscapeHatch } from '../escape-hatch';
import useValue from '../../fp-ts/use-value';

type FailureFromReason = {
  startIndex: number;
} & FailureReason;

export default abstract class BaseParser<
  Units extends string,
  NodeType extends RemarkNode,
  Content = any,
  Extra extends object = any,
> extends ContentHandler<Content> {
  protected abstract _getDefaultParsers<DefaultUnits extends Units>(
    options: any,
  ): ParserUnits<DefaultUnits, NodeType>;

  private _parsers: ParserUnits<Units, NodeType> = {};

  public constructor(
    content: Content[],
    configureParsers: (
      baseOptions: ParserUnits<Units, NodeType>,
    ) => ParserUnits<Units, NodeType> = skip,
    private options: any = undefined,
  ) {
    super(content);
    this._parsers = configureParsers(this._getDefaultParsers(this.options));
  }

  private RecursiveParse =
    (
      unitType: Units,
      parsers: BaseSubParser<Units, NodeType, NodeType>[],
      startPosition: number,
      index = 0,
      leaves: ParseTree<Units, NodeType>[] = [],
    ) =>
    (
      original: ParserData<Units, NodeType>,
    ): E.Either<FailureFromReason, NodeType> =>
      flow(
        E.fromPredicate(
          // Typescript needs this in order to recognize data's type later
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (data: ParserData<Units, NodeType>) => {
            return index < parsers.length;
          },
          () => ({
            ...failReason(false, `No fitting parser found for ${unitType}!`),
            startIndex: startPosition,
          }),
        ),
        E.chain(
          flow(
            setUpData<Units, NodeType>,
            // edit((d) =>
            //   console.log(
            //     'about to parse',
            //     unitType,
            //     parsers[index].StringifiedScheme(),
            //     original.parser.currentIndex(),
            //   ),
            // ),
            tryParse((d) => parsers[index].Parse(d)),
            biChain<
              E.Either<ParserData<Units, NodeType>, NodeType>,
              FailureReason,
              E.Either<FailureFromReason, NodeType>
            >(
              flow(
                biChain<
                  NodeType,
                  ParserData<Units, NodeType>,
                  E.Either<FailureFromReason, NodeType>
                >(
                  flow(
                    edit((node) => {
                      original._parseTreeLeaves.push({
                        type: 'Parser',
                        status: 'Success',
                        startIndex: startPosition,
                        endIndex: this._currentPosition,
                        parserIndex: index,
                        parserScheme: parsers[index].StringifiedScheme(),
                        node,
                        children: leaves,
                      } as ParseTreeStepParser<Units, NodeType>);
                    }),
                    E.right,
                  ),
                  () =>
                    this.RecursiveParse(
                      unitType,
                      parsers,
                      startPosition,
                      index + 1,
                      leaves,
                    )(original),
                ),
              ),
              flow(
                edit((reason) => {
                  original._parseTreeLeaves.push({
                    type: 'Parser',
                    status: 'Failure',
                    startIndex: startPosition,
                    endIndex: this._currentPosition,
                    parserIndex: index,
                    parserScheme: parsers[index].StringifiedScheme(),
                    reason: reason.reason,
                    correctParser: reason.correctParser,
                    children: leaves,
                  } as ParseTreeStepParser<Units, NodeType>);
                }),
                (reason) =>
                  ({
                    ...reason,
                    startIndex: startPosition,
                  } as FailureFromReason),
                E.left,
              ),
            ),
          ),
        ),
      )({
        parser: this,
        escapeHatch: original.escapeHatch,
        layerData: original.parentConfig ?? {},
        parentConfig: {},
        _parseTreeLeaves: leaves,
        extra: original.extra,
      } as ParserData<Units, NodeType>);

  public ParseUnit = (
    unitType: Units,
    rewindOnFailure = false,
    childLeaves: ParseTree<Units, NodeType>[] = [],
    parentLeaves: ParseTree<Units, NodeType>[] = childLeaves,
  ) =>
    flow(
      edit((data: ParserData<Units, NodeType>) => {
        parentLeaves = data._parseTreeLeaves;
        data._parseTreeLeaves = childLeaves;
      }),
      useValue(() =>
        this.RecursiveParse(
          unitType,
          this._parsers[unitType] ?? [],
          this._currentPosition,
        ),
      ),
      E.mapLeft(
        flow(
          edit((reason) => {
            parentLeaves.push({
              type: 'ParseUnit',
              status: 'Failure',
              correctParser: reason.correctParser,
              unit: unitType,
              children: childLeaves,
            } as ParseTreeStepParseUnit<Units, NodeType>);
          }),
          runIf(
            edit((reason) => {
              parentLeaves.push({
                initialIndex: reason.startIndex,
                lastIndex: this._currentPosition,
              } as ParseTreeStepRewind);
              this._currentPosition = reason.startIndex;
            }),
            rewindOnFailure,
          ),
        ),
      ),
      E.map(
        edit(() => {
          parentLeaves.push({
            type: 'ParseUnit',
            status: 'Success',
            unit: unitType,
            children: childLeaves,
          } as ParseTreeStepParseUnit<Units, NodeType>);
        }),
      ),
    );

  public ParseUnitRoot = (
    unit: Units,
    escapeHatch: EscapeHatch,
    parentConfig: { [key: string]: any },
    extra?: Extra,
    rewindOnFailure = false,
    leaves: ParseTree<Units, NodeType>[] = [],
  ) =>
    ((data: ParserData<Units, NodeType>) => ({
      result: this.ParseUnit(unit, rewindOnFailure)(data),
      data: {
        ...data,
        parseTreeLeaves: leaves,
      },
    }))({
      _parseTreeLeaves: leaves,
      escapeHatch,
      parser: this,
      layerData: {},
      parentConfig,
      extra,
    } as ParserData<Units, NodeType>);
}

export type ParserUnits<
  Units extends string,
  NodeType extends RemarkNode<any, any>,
> = {
  // False unused vars detection
  // eslint-disable-next-line no-unused-vars
  [key in Units]?: BaseSubParser<key, NodeType, NodeType>[];
};
