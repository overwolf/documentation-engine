import mdxComponents from '../../../../src/theme/MDXComponents';
import Tagger from '@site/src/plugins/content-tags/theme/tagger';
import DisplayJSON from '@site/src/plugins/display-json/theme';

const MDXComponents = {
  ...mdxComponents,
  Tagger,
  ...DisplayJSON,
};

export default MDXComponents;
