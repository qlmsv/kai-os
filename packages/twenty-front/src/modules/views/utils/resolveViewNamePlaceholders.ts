import { t } from '@lingui/core/macro';
import { type FlatObjectMetadataItem } from '@/metadata-store/types/FlatObjectMetadataItem';
import { isDefined } from 'twenty-shared/utils';

// The server stores every standard index view under this literal name
// (see computeFlatIndexViewToCreate). Only the placeholder was substituted
// here, so the "All" prefix reached the navigation untranslated and rendered
// as "All Компании" on a Russian workspace. Matching the template lets the
// whole label go through a catalog.
const STANDARD_INDEX_VIEW_NAME = 'All {objectLabelPlural}';

export const resolveViewNamePlaceholders = (
  viewName: string | undefined,
  objectMetadataItem: FlatObjectMetadataItem | undefined,
): string => {
  if (!isDefined(viewName) || !isDefined(objectMetadataItem)) {
    return viewName ?? '';
  }

  if (viewName === STANDARD_INDEX_VIEW_NAME) {
    return t`All ${objectMetadataItem.labelPlural}`;
  }

  return viewName
    .replace('{objectLabelPlural}', objectMetadataItem.labelPlural)
    .replace('{objectLabelSingular}', objectMetadataItem.labelSingular);
};
