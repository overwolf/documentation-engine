import * as E from 'fp-ts/lib/Either';
import { FailureReason } from '../parsing/sub-parsers/sub-parser';
import chainLeft from '../../fp-ts/chain-left';
import { ParserData } from '../parsing/data';

export default <PD extends ParserData<any, any>>(data: PD) =>
  chainLeft<FailureReason, PD>((reason) =>
    reason.correctParser ? E.left(reason) : E.right(data),
  );
