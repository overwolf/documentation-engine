const config = require('../lib/config/docusaurus');
const codeComponentTagger = require('./lib/plugins/content-tags/remark/tagger').default;
const displayJSON = require('./lib/plugins/display-json/remark/plugin').default;
const highlight = require('./lib/plugins/highlight/remark/plugin').default;
const merge = require('./lib/utils/merge').default;

const pluginPath = (name) => `./lib/plugins/${name}/index.js`;

const defaultConfig = {
  // title: '', // website title
  themes: [pluginPath('engine-module'), pluginPath('content-tags'), pluginPath('display-json'), pluginPath('open-api'), pluginPath('highlight')], // themes (client side code)
  staticDirectories: ['../static'],
  // tagline: '', // website tagline
  // url: '', // website url
  baseUrl: '/',
  trailingSlash: false,
  // organizationName: '', // github organization name
  // projectName: '', // github repo name
  deploymentBranch: 'gh-pages',
  // scripts: [] // scripts to be added to every page in the website
  stylesheets: [
    'https://fonts.googleapis.com/css?family=Lato%3A400%2C400i%2C700%2C900&ver=4.5.3',
    'https://fonts.googleapis.com/css?family=Montserrat%3A400%2C500%2C600%2C700%2C900&ver=4.5.3',
  ],
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  plugins: [ // plugins (server side code)
    'docusaurus-plugin-sass',
    'docusaurus-plugin-clarity',
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: {},
      },
    ],
    [
      'docusaurus-gtm-plugin',
      {
        id: '', // google gtm id
      },
    ],
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          remarkPlugins: [codeComponentTagger, displayJSON, highlight],
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
          // editUrl: '', // url for suggesting edits
          path: '../pages',
          routeBasePath: '/',
          // sidebarPath: '', // path to sidebar items
          // sidebarItemsGenerator: '', // custom sidebar item generator
          sidebarCollapsible: true,
          sidebarCollapsed: true,
        },
        blog: {},
        theme: {
          // customCss: [], // global css stylesheets
        },
        pages: {
          path: '../src/pages'
        }
      },
    ],
  ],
  themeConfig: {
    docs: {
      sidebar: {
        autoCollapseCategories: true,
      },
    },
    metadata: [
      // {
      //   name: 'google-site-verification',
      //   content: '', // google site verification data
      // },
    ],
    clarity: {
      // ID: '', // clarity id
    },
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      style: 'dark',
      // title: '', // navbar title
      // logo: {
      //   alt: '',
      //   src: '',
      //   srcDark: '',
      // }, // navbar logo
      // items: [], // navbar items
    },
    // image: '', // default embed image
    prism: {
      additionalLanguages: ['powershell', 'yaml'],
    },
    algolia: {
      // apiKey: '', // algolia api key
      // indexName: '', // algolia index name
      // appId: '', // algolia app id
      contextualSearch: true,
      algoliaOptions: {},
    },
  },
};

const finalizeConfig = async(d, t) => merge(d, await t)

const fullConfig = finalizeConfig(defaultConfig, config);

module.exports = fullConfig;
