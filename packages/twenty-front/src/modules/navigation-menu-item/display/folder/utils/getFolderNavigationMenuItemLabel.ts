import { t } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';
import { type NavigationMenuItem } from '~/generated-metadata/graphql';
import { translateSeededLabel } from '~/utils/i18n/translateSeededLabel';

export const getFolderNavigationMenuItemLabel = (
  item: Pick<NavigationMenuItem, 'name'>,
): string => {
  if (!isDefined(item.name)) {
    return t`Folder`;
  }

  // Standard folders are seeded with an English name (see
  // STANDARD_NAVIGATION_MENU_ITEMS); user-created ones fall back to themselves.
  return translateSeededLabel(item.name);
};
