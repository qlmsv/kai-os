import { t } from '@lingui/core/macro';

// The engine seeds these command-menu labels in English and ships them to the
// client as raw expression templates (STANDARD_COMMAND_MENU_ITEMS on the
// server). They used to be interpolated first and looked up in a catalog
// after, which never matches — so a Russian workspace rendered
// "Update Компании" with the verb left in English.
//
// Declaring the messages here with the macro is also what puts them in the
// catalogs at all: the extract step runs with --clean and drops any message it
// cannot find in the source, so a hand-written catalog entry would not survive
// a build.
export const translateStandardCommandMenuItemLabel = (
  rawLabel: string,
  objectLabel: string,
): string | undefined => {
  switch (rawLabel) {
    case 'Navigate to next ${capitalize(objectMetadataItem.labelSingular)}':
      return t`Navigate to next ${objectLabel}`;
    case 'Create new ${capitalize(objectMetadataItem.labelSingular)}':
      return t`Create new ${objectLabel}`;
    case 'Delete ${capitalize(objectMetadataLabel)}':
      return t`Delete ${objectLabel}`;
    case 'Restore ${capitalize(objectMetadataLabel)}':
      return t`Restore ${objectLabel}`;
    case 'Permanently destroy ${capitalize(objectMetadataLabel)}':
      return t`Permanently destroy ${objectLabel}`;
    case 'Export ${capitalize(objectMetadataLabel)}':
      return t`Export ${objectLabel}`;
    case 'Update ${capitalize(objectMetadataItem.labelPlural)}':
      return t`Update ${objectLabel}`;
    case 'Merge ${capitalize(objectMetadataItem.labelPlural)}':
      return t`Merge ${objectLabel}`;
    case 'Import ${capitalize(objectMetadataItem.labelPlural)}':
      return t`Import ${objectLabel}`;
    case 'See deleted ${capitalize(objectMetadataItem.labelPlural)}':
      return t`See deleted ${objectLabel}`;
    case 'Hide deleted ${capitalize(objectMetadataItem.labelPlural)}':
      return t`Hide deleted ${objectLabel}`;
    case 'Deleted ${capitalize(objectMetadataItem.labelPlural)}':
      return t`Deleted ${objectLabel}`;
    default:
      return undefined;
  }
};
