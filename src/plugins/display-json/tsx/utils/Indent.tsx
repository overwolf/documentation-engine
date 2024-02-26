import React, { useContext } from 'react';
import { IndentContext } from './IndentContext';

function Indent(props: { extra?: number }) {
  const { extra } = props;
  // ---------------------------------------------------------------------------
  const indentLevel = useContext(IndentContext);
  return <>{' '.repeat(indentLevel + (extra ?? 0))}</>;
}

export default Indent;
