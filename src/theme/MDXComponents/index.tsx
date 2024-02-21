import mdxComponents from '../../../../src/theme/MDXComponents';
import Tagger from '../../plugins/content-tags/theme/tagger';
import DisplayJSON from '../../plugins/display-json/theme/index';

const MDXComponents = {
  ...mdxComponents,
  Tagger,
  ...DisplayJSON,
};

export default MDXComponents;
