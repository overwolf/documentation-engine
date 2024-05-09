export const enum ChoiceGroups {
  GENERATED_FETCH = 'generated-fetch',
  FRAMEWORKS = 'frameworks',
  SUBSCRIPTIONS = 'subscriptions',
  HASHED_EMAILS = 'hashed-emails',
  PACKAGE_MANAGER = 'package-manager',
  SAMPLE_BUILD = 'build-app',
}

type ChoiceGroupOptions<Choices extends string = string> = {
  [key in Choices]: string;
};

export const ChoiceGroupOptions = {
  [ChoiceGroups.GENERATED_FETCH]: {
    curl: 'cURL',
    'javascript-fetch': 'Javascript (Fetch)',
  },
  [ChoiceGroups.FRAMEWORKS]: {
    'overwolf-platform': 'Overwolf Platform',
    'overwolf-electron': 'Overwolf Electron',
  },
  [ChoiceGroups.SUBSCRIPTIONS]: {
    overwolf: 'Overwolf Subscriptions',
    headless: 'Tebex Headless',
    checkout: 'Tebex Checkout',
  },
  [ChoiceGroups.HASHED_EMAILS]: {
    'email-full': 'Email (Full)',
    'email-hash': 'Email (Hashed)',
  },
  [ChoiceGroups.PACKAGE_MANAGER]: { npm: 'npm', yarn: 'yarn' },
  [ChoiceGroups.SAMPLE_BUILD]: {
    'download-opk': 'Download OPK',
    'download-unpacked': 'Download Unpacked',
    'local-build': 'Build Locally',
  },
} as const;

export const ChoiceGroupIcons: Partial<{
  [key in ChoiceGroups]: { [item in ValidKeys<key>]: string };
}> = {
  // [ChoiceGroups.GENERATED_FETCH]: {
  //   'javascript-fetch': '',
  //   curl: '',
  // },
  [ChoiceGroups.FRAMEWORKS]: {
    'overwolf-electron': '',
    'overwolf-platform': '',
  },
  // [ChoiceGroups.SUBSCRIPTIONS]: {
  //   checkout: '',
  //   headless: ' ',
  //   overwolf: '',
  // },
  // [ChoiceGroups.HASHED_EMAILS]: {
  //   'email-full': '',
  //   'email-hash': '',
  // },
  // [ChoiceGroups.PACKAGE_MANAGER]: { npm: '', yarn: '' },
  // [ChoiceGroups.SAMPLE_BUILD]: {
  //   'download-opk': '',
  //   'download-unpacked': '',
  //   'local-build': '',
  // },
};

export type ValidKeys<ChoiceGroup extends ChoiceGroups> =
  keyof (typeof ChoiceGroupOptions)[ChoiceGroup];

const _validateChoiceGroupOptions = ChoiceGroupOptions as {
  [key in ChoiceGroups]: ChoiceGroupOptions;
};

export const ChoiceGroupOrder: {
  [key in ChoiceGroups]: ValidKeys<key>[];
} = {
  [ChoiceGroups.GENERATED_FETCH]: ['curl', 'javascript-fetch'],
  [ChoiceGroups.FRAMEWORKS]: ['overwolf-platform', 'overwolf-electron'],
  [ChoiceGroups.SUBSCRIPTIONS]: ['overwolf', 'headless', 'checkout'],
  [ChoiceGroups.HASHED_EMAILS]: ['email-full', 'email-hash'],
  [ChoiceGroups.PACKAGE_MANAGER]: ['npm', 'yarn'],
  [ChoiceGroups.SAMPLE_BUILD]: [
    'download-opk',
    'download-unpacked',
    'local-build',
  ],
};

export const ChoiceGroupDefaults: {
  [key in ChoiceGroups]: ValidKeys<key>;
} = {
  [ChoiceGroups.GENERATED_FETCH]: 'curl',
  [ChoiceGroups.FRAMEWORKS]: 'overwolf-platform',
  [ChoiceGroups.SUBSCRIPTIONS]: 'overwolf',
  [ChoiceGroups.HASHED_EMAILS]: 'email-full',
  [ChoiceGroups.PACKAGE_MANAGER]: 'npm',
  [ChoiceGroups.SAMPLE_BUILD]: 'local-build',
};
