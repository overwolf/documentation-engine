import React from 'react';
import '../scss/highlight.scss';
import clsx from 'clsx';
import { DirectiveMap } from '../remark/options';

function Highlight({ rawContent: [content] }: { rawContent: string[] }) {
  // const {} = props;

  // ---------------------------------------------------------------------------

  return (
    <span className={clsx('highlight-directive', DirectiveMap[content])}>
      {content}
    </span>
  );
}

export default Highlight;
