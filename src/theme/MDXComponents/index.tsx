import mdxComponents from '../../../../src/theme/MDXComponents';
import Tagger from '../../plugins/content-tags/theme/tagger';
import DisplayJSON from '../../plugins/display-json/theme/index';
import StandardComponents from '../../components';
import Highlight from '../../plugins/highlight/theme/index';

// TODO - convert this to dynamically get the mdx comps from all plugins
const MDXComponents = {
  ...mdxComponents,
  Tagger,
  ...DisplayJSON,
  ...StandardComponents,
  ...Highlight,
};

console.log(DisplayJSON);

export default MDXComponents;
