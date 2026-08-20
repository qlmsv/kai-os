import { i18n, type MessageDescriptor } from '@lingui/core';
import { STANDARD_COMMAND_MENU_ITEM_MESSAGES } from '@/command-menu-item/utils/standardCommandMenuItemMessages';
import { type Nullable } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const getCommandMenuItemLabel = (
  label: Nullable<string | MessageDescriptor>,
): string => {
  if (!isDefined(label)) {
    return '';
  }

  if (typeof label === 'string') {
    // Compiled catalogs are keyed by generated ids, so passing the raw English
    // label to i18n._() never resolves — it just echoes the label back. Known
    // engine-seeded labels are looked up through their declared descriptor
    // instead; anything else keeps the previous behaviour.
    const descriptor = STANDARD_COMMAND_MENU_ITEM_MESSAGES[label];

    return isDefined(descriptor) ? i18n._(descriptor) : i18n._(label);
  }

  const { id, values, ...options } = label;

  return i18n._(id, values, options);
};
