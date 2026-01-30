import React from 'react';
import { LocaleSwitcherProps } from '../types';
import { DropdownSwitcher } from './DropdownSwitcher';
import { FlagsSwitcher } from './FlagsSwitcher';
import { MinimalSwitcher } from './MinimalSwitcher';

export function LocaleSwitcher(props: LocaleSwitcherProps) {
  const { variant = 'dropdown' } = props;

  switch (variant) {
    case 'flags':
      return <FlagsSwitcher {...props} />;
    case 'minimal':
      return <MinimalSwitcher {...props} />;
    case 'dropdown':
    default:
      return <DropdownSwitcher {...props} />;
  }
}
