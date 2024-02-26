import React from 'react';
import { DisplayJSONReactNode } from '../../core/node';
import { DisplayJSONUnits } from '../../core/units';
import { LINE_SEPARATOR } from '../../../_base/remark/plugins/plugin-defaults';
import NewLine from '../../tsx/syntactic/NewLine';
import Indent from '../../tsx/utils/Indent';
import Space from '../../tsx/syntactic/Space';

const CommentNode: DisplayJSONReactNode<DisplayJSONUnits.Comment> = ({
  sequence,
}) => {
  const { start, content, linePrefix, indent, end } = sequence;
  const multiLine = linePrefix && content.includes(LINE_SEPARATOR);
  return (
    <>
      <Seq value={start} />
      {multiLine ? <NewLine /> : <Space />}
      {content.split(LINE_SEPARATOR).map((line, index) => (
        <React.Fragment key={index}>
          {multiLine && (
            <>
              <Indent extra={indent} />
              <span className="prefix">{linePrefix}</span>
            </>
          )}
          {line /* Apply extra formatting here */}
          {multiLine ? <NewLine /> : end && <Space />}
        </React.Fragment>
      ))}
      {multiLine && <Indent extra={indent} />}
      {end && <Seq value={end} />}
    </>
  );
};

const Seq = ({ value }: { value: string }) => (
  <span className="delimiter">{value}</span>
);

export default CommentNode;
