import { t } from '@lingui/core/macro';
import { type FlatObjectMetadataItem } from '@/metadata-store/types/FlatObjectMetadataItem';
import { ViewKey } from '@/views/types/ViewKey';
import { isDefined } from 'twenty-shared/utils';
import { translateSeededLabel } from '~/utils/i18n/translateSeededLabel';

export const resolveViewNamePlaceholders = (
  viewName: string | undefined,
  objectMetadataItem: FlatObjectMetadataItem | undefined,
  viewKey?: ViewKey | null,
): string => {
  if (!isDefined(viewName) || !isDefined(objectMetadataItem)) {
    return viewName ?? '';
  }

  // The engine owns the index view of every object and names it in English —
  // either as the "All {objectLabelPlural}" template or, on workspaces created
  // by older versions, with the label already substituted ("All Companies").
  // Keying off ViewKey.INDEX covers both without mistaking a user-created view
  // that happens to start with "All" for a standard one.
  if (viewKey === ViewKey.INDEX) {
    return t`All ${objectMetadataItem.labelPlural}`;
  }

  const resolvedName = viewName
    .replace('{objectLabelPlural}', objectMetadataItem.labelPlural)
    .replace('{objectLabelSingular}', objectMetadataItem.labelSingular);

  // Other standard views ("By Stage", "Runs", …) are seeded in English too.
  return translateSeededLabel(resolvedName);
};
