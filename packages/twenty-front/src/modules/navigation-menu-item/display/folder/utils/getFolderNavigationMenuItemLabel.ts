import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export const getFolderNavigationMenuItemLabel = (
  item: Pick<NavigationMenuItem, 'name'>,
): string => {
  if (!isDefined(item.name)) {
    return t`Folder`;
  }

  // Standard folders are seeded with an English name (see
  // STANDARD_NAVIGATION_MENU_ITEMS) and were rendered raw. Looking the name up
  // as a catalog id translates the seeded ones and leaves user-created folder
  // names untouched, since a missing id falls back to itself.
  return i18n._(item.name);
};
