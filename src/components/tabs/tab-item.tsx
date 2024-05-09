import { TabItemContext } from './contexts/tab-item-context';
import React, { PropsWithChildren, useContext } from 'react';
import ImageToggle from '../../../../src/components/image-toggle/image-toggle';
import {
  classNamer,
  DefaultVariants,
  StandardProps,
} from '../../utils/renderer/props/standard';
import {
  ChoiceGroupOptions,
  ChoiceGroups,
} from '../../types/assets/choice-groups';

export const enum TabItemLabelVariants {
  OPEN_API_PARAMS = 'open-api-params',
  OPEN_API_RESPONSE = 'open-api-response',
}
// export const enum TabItemPanelVariants {}
export type TabItemPanelVariants = never;

export type TabItemProps = {
  tabId: string;
  label: string;
  choiceGroup?: ChoiceGroups;
  labelProps?: IndividualProps<TabItemLabelVariants>;
  panelProps?: IndividualProps<TabItemPanelVariants>;
  tabIcon?: string;
  disabled?: boolean;
};

type IndividualProps<Variant extends string> = Partial<
  PropsWithChildren<StandardProps<TabItemProps, Variant>> & {
    index: number;
  }
>;

export function TabItemRenderers(props: TabItemProps) {
  const id = props.tabId;
  const label = props.choiceGroup
    ? ChoiceGroupOptions[props.choiceGroup][id]
    : props.label;
  if (label === undefined)
    throw new Error(
      // eslint-disable-next-line max-len
      `Invalid label/id in tab! (Is the choice group option wrong?) id: ${id}, original label: ${props.label}, choiceGroup: ${props.choiceGroup}`,
    );
  return {
    id,
    disabled: props.disabled,
    Label: (iProps?: IndividualProps<TabItemLabelVariants>) =>
      TabItemLabel({ ...props, label, ...props.labelProps, ...iProps }),
    Panel: (iProps?: IndividualProps<TabItemPanelVariants>) =>
      TabItemPanel({ ...props, label, ...props.panelProps, ...iProps }),
  };
}

export function TabItemLabel({
  tabId,
  disabled,
  children,
  tabIcon,
  label,
  variant = DefaultVariants.DEFAULT,
  extraClassNames,
  style,
}: IndividualProps<TabItemLabelVariants>) {
  const [tabItem, setTabItem] = useContext(TabItemContext);
  const isActive = tabItem === tabId;

  return (
    <button
      disabled={disabled}
      role="tab"
      className={classNamer({
        classNames: {
          'tab-label': true,
          active: isActive,
          disabled,
        },
        variant,
        extraClassNames,
      })}
      style={style}
      onClick={!isActive && !disabled ? () => setTabItem(tabId) : undefined}
    >
      {tabIcon && <ImageToggle imgSrc={tabIcon} alt={`${label} icon`} />}
      {children ?? label}
    </button>
  );
}

export function TabItemPanel({
  tabId,
  disabled,
  children,
  variant = DefaultVariants.DEFAULT,
  extraClassNames,
  style,
}: IndividualProps<TabItemPanelVariants>) {
  const [tabItem] = useContext(TabItemContext);
  const isActive = tabItem === tabId;

  return (
    <section
      id={`${tabId}-panel`}
      role="tabpanel"
      className={classNamer({
        classNames: {
          'tab-panel': true,
          active: isActive,
          disabled,
        },
        variant,
        extraClassNames,
      })}
      style={style}
    >
      {children}
    </section>
  );
}

// export default TabItem;
