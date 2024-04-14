import type {
  BasePluginOptions,
  PLUGIN_TYPE,
} from '../../_base/remark/plugins/plugin';

export const defaultOptions = {
  openingTag: '!' as string,
  closingTag: '' as string,
  includeOpening: true as boolean,
  includeClosing: true as boolean,
  locateOpeningTag: true as boolean,
  parseContent: false as boolean,
  pluginType: {
    inline: true,
  } as PLUGIN_TYPE,
  types: [
    'MUST NOT',
    'MUST ALWAYS',
    'MUST ONLY',
    'MUST',
    'MAY ONLY',
    'MAY',
    'ALWAYS',
    'SOMETIMES',
  ] as (keyof typeof DirectiveMap)[],
};

export enum DirectiveTypes {
  MUST = 'must',
  MAY = 'may',
  ALWAYS = 'always',
  SOMETIMES = 'sometimes',
}

export const DirectiveMap = {
  'MUST NOT': DirectiveTypes.MUST,
  'MUST ALWAYS': DirectiveTypes.MUST,
  'MUST ONLY': DirectiveTypes.MUST,
  MUST: DirectiveTypes.MUST,
  MAY: DirectiveTypes.MAY,
  'MAY ONLY': DirectiveTypes.MAY,
  ALWAYS: DirectiveTypes.ALWAYS,
  SOMETIMES: DirectiveTypes.SOMETIMES,
};

export type HighlightOptions = Options<typeof defaultOptions>;

/** Convenience guard type & redundancy to make typescript not error */
type Options<T extends BasePluginOptions> = T & BasePluginOptions;
