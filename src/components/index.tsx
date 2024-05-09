import positionTable from './table';
import tabs, { TabsMacros } from './tabs';

export default {
  ...positionTable,
  ...tabs,
};

export const Macros = {
  ...TabsMacros,
};
