import { RecordTypes } from '../enums/DisplayJSONRecordTypes';

export type DisplayJSONPropsChildren<Uniques = {}> = React.PropsWithChildren<
  DisplayJSONProps<Uniques>
>;
export type DisplayJSONProps<Uniques = {}> = Uniques;

export interface Root {
  name: string;
}

export interface Comment {
  comment: string;
}
export type CommentLine = Comment;
export type CommentBlock = Comment;

export interface StringValue {
  value: string;
}

export type SingleQuote = StringValue;
export type DoubleQuote = StringValue;
export type BacktickQuote = StringValue;

export interface TypeDefinition {
  name: string;
}

export interface RecordDefinition {
  name: string;
}

export interface TopLevelRecordDefinition extends RecordDefinition {
  type: RecordTypes;
}
