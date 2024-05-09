import './tabs.scss';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { TabItemContextProvider } from './contexts/tab-item-context';
import { TabItemProps, TabItemRenderers } from './tab-item';
import {
  classNamer,
  DefaultVariants,
  StandardProps,
} from '../../utils/renderer/props/standard';
import {
  ChoiceGroupDefaults,
  ChoiceGroupIcons,
  ChoiceGroupOptions,
  ChoiceGroups,
  ValidKeys,
} from '../../types/assets/choice-groups';
import { useLocalStorage } from 'usehooks-ts';
import useChoiceGroupHook from '../../hooks/choice-group';

export const enum TabsVariants {
  OPEN_API_PARAMS = 'open-api-params',
  OPEN_API_RESPONSE = 'open-api-response',
}

type TabsProps = StandardProps<
  {
    /**
     * Whether or not the content of each tab should completely fill the tab,
     * or be padded from its edges
     *
     * @default false (apply padding)
     */
    fillContent?: boolean;

    /**
     * The default tab id that should be used
     */
    defaultTab?: string;

    /**
     * The renderers for the different tabs
     */
    renderers: ReturnType<typeof TabItemRenderers>[];

    /**
     * Whether active tabs should be grouped separately from inactive tabs
     *
     * @default false (do not group)
     */
    groupActive?: boolean;

    /**
     * Whether or not the tab labels should stretch out over the entire tab area
     *
     * @default false (do stretch)
     */
    stretchLabels?: boolean;
  } & (
    | {
        /**
         * An optional choice group, that will synchronize tab choices accross
         * all supported components, and accross pages (using localStorage)
         *
         * @default undefined (no group)
         */
        choiceGroup?: ChoiceGroups;

        externallyManaged: false;
      }
    | {
        /**
         * Should the active tab be managed externally or internally
         *
         * @default false (self managed)
         */
        externallyManaged?: true;

        choiceGroup: undefined;
      }
    | {
        externallyManaged?: undefined;
        choiceGroup?: undefined;
      }
  ),
  TabsVariants
>;

// -----------------------------------------------------------------------------

function Tabs({
  defaultTab,
  externallyManaged = false,
  renderers,
  fillContent = false,
  groupActive = false,
  stretchLabels = false,
  variant = DefaultVariants.DEFAULT,
  extraClassNames,
  choiceGroup,
  style,
}: TabsProps) {
  const tabState = choiceGroup
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useChoiceGroupHook(choiceGroup)
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useState(defaultTab ?? renderers.find((props) => !props.disabled)?.id);
  const TabItemManager = externallyManaged
    ? ({ children }: PropsWithChildren) => <>{children}</>
    : ({ children }: PropsWithChildren) => (
        <TabItemContextProvider tabState={tabState}>
          {children}
        </TabItemContextProvider>
      );
  // ---------------------------------------------------------------------------

  if (groupActive)
    renderers.sort(
      ({ disabled: a }, { disabled: b }) => (!a && -1) + (!b && 1),
    );

  return (
    <section className="tabs" style={style}>
      <TabItemManager>
        <div
          className={classNamer({
            classNames: {
              labels: true,
              'stretch-labels': stretchLabels,
            },
            variant,
            extraClassNames,
          })}
          role="tablist"
        >
          {renderers.map(({ Label, id }, index) => (
            <Label key={id} index={index} />
          ))}
        </div>
        <div
          className={classNamer({
            classNames: {
              container: true,
              padded: !fillContent,
            },
            variant,
            extraClassNames,
          })}
        >
          {renderers.map(({ Panel, id }, index) => (
            <Panel key={id} index={index} />
          ))}
        </div>
      </TabItemManager>
    </section>
  );
}

type ChoiceGroupsTabsProps<ChoiceGroup extends ChoiceGroups> = Required<
  Pick<TabsProps, 'choiceGroup'>
> &
  Omit<
    TabsProps,
    'renderers' | 'defaultTab' | 'externallyManaged' | 'choiceGroup'
  > & {
    choiceGroup: ChoiceGroup;
    panels: {
      [key in ValidKeys<ChoiceGroup>]: TabItemProps['panelProps'];
    };
  };

export const ChoiceGroupsTabs = <ChoiceGroup extends ChoiceGroups>({
  variant,
  choiceGroup,
  extraClassNames,
  fillContent,
  groupActive,
  stretchLabels = false,
  panels,
  style,
}: ChoiceGroupsTabsProps<ChoiceGroup>) => {
  const givenTabs = Object.keys(panels);
  const groupOptions = ChoiceGroupOptions[choiceGroup];
  if (
    Object.keys(panels).some((key) => !Object.keys(groupOptions).includes(key))
  )
    throw Error(
      // eslint-disable-next-line max-len
      `Invalid tabs given for group ${choiceGroup}, expected tab in list ${Object.keys(
        groupOptions,
      ).toString()} and received ${givenTabs.toString()}`,
    );
  return (
    <Tabs
      renderers={Object.keys(panels).map((key) =>
        TabItemRenderers({
          tabId: key,
          label: groupOptions[key],
          choiceGroup,
          // labelProps: {},
          panelProps: panels[key].children
            ? panels[key]
            : { children: panels[key] },
          tabIcon: ChoiceGroupIcons[choiceGroup][key],
        }),
      )}
      variant={variant}
      choiceGroup={choiceGroup}
      externallyManaged={false}
      fillContent={fillContent}
      stretchLabels={stretchLabels}
      groupActive={groupActive}
      defaultTab={ChoiceGroupDefaults[choiceGroup] as string}
      extraClassNames={extraClassNames}
      style={style}
    />
  );
};

export default Tabs;
