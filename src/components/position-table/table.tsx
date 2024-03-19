import React, { PropsWithChildren } from 'react';
import './table.scss';

type TableChildren = {
  asTable: boolean;
};

function Table({ asTable, children }: PropsWithChildren<TableChildren>) {
  return (
    <ul role={asTable ? 'presentation' : undefined} className="position-table">
      {children}
    </ul>
  );
}

export default Table;
