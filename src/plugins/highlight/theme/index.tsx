import React from 'react';
import {
  reactNodesToProvider,
  ReactNodeStructure,
} from '../../_base/core/nodes';
import {
  DEFAULT_COMPONENT,
  DEFAULT_STRUCTURE,
} from '../../_base/remark/plugins/plugin-defaults';
import { nodeType } from '../core/structure';
import Highlight from './highlight';

const defaultStructure = DEFAULT_STRUCTURE(nodeType, {});

export default reactNodesToProvider(
  nodeType,
  {
    [nodeType]: Highlight,
  } as unknown as ReactNodeStructure<
    typeof DEFAULT_COMPONENT,
    typeof nodeType,
    ReturnType<typeof DEFAULT_STRUCTURE>
  >,
  (_key, Value): typeof Value =>
    // eslint-disable-next-line react/display-name
    (props) =>
      {
        console.log(props);
        return <Value {...props} />;
      },
  defaultStructure,
);
