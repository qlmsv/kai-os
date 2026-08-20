import { currentUserWorkspaceState } from '@/auth/states/currentUserWorkspaceState';
import { fieldMetadataItemsSelector } from '@/metadata-store/states/fieldMetadataItemsSelector';
import { indexMetadataItemsSelector } from '@/metadata-store/states/indexMetadataItemsSelector';
import { flatObjectMetadataItemsSelector } from '@/object-metadata/states/flatObjectMetadataItemsSelector';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { getNonReadableFieldMetadataIdsFromObjectPermissions } from '@/object-metadata/utils/getNonReadableFieldMetadataIdsFromObjectPermissions';
import { getNonUpdatableFieldMetadataIdsFromObjectPermissions } from '@/object-metadata/utils/getNonUpdatableFieldMetadataIdsFromObjectPermissions';
import { getObjectPermissionsFromMapByObjectMetadataId } from '@/settings/roles/role-permissions/objects-permissions/utils/getObjectPermissionsFromMapByObjectMetadataId';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';
import { type ObjectPermissions } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { translateSeededLabel } from '~/utils/i18n/translateSeededLabel';

export const objectMetadataItemsWithFieldsSelector = createAtomSelector<
  EnrichedObjectMetadataItem[]
>({
  key: 'objectMetadataItemsWithFieldsSelector',
  get: ({ get }) => {
    const flatObjects = get(flatObjectMetadataItemsSelector);
    const allFlatFields = get(fieldMetadataItemsSelector);
    const allFlatIndexes = get(indexMetadataItemsSelector);
    const currentUserWorkspace = get(currentUserWorkspaceState);

    const fieldsByObjectId = new Map<
      string,
      (typeof allFlatFields)[number][]
    >();

    for (const field of allFlatFields) {
      const existing = fieldsByObjectId.get(field.objectMetadataId);

      if (isDefined(existing)) {
        existing.push(field);
      } else {
        fieldsByObjectId.set(field.objectMetadataId, [field]);
      }
    }

    const indexesByObjectId = new Map<
      string,
      (typeof allFlatIndexes)[number][]
    >();

    for (const index of allFlatIndexes) {
      const existing = indexesByObjectId.get(index.objectMetadataId);

      if (isDefined(existing)) {
        existing.push(index);
      } else {
        indexesByObjectId.set(index.objectMetadataId, [index]);
      }
    }

    const objectPermissionsByObjectMetadataId =
      currentUserWorkspace?.objectsPermissions.reduce(
        (accumulator, objectPermission) => {
          accumulator[objectPermission.objectMetadataId] = objectPermission;

          return accumulator;
        },
        {} as Record<string, ObjectPermissions & { objectMetadataId: string }>,
      ) ?? {};

    return flatObjects.map((flatObject) => {
      // System fields ("Creation date", "Created by", …) and system-managed
      // relations are seeded in English and cannot be renamed through the
      // metadata API, so their labels are localized here. A label the user has
      // overridden already arrives translated and is left untouched, since the
      // lookup only matches the known seeded names.
      const fields = (fieldsByObjectId.get(flatObject.id) ?? []).map((field) =>
        field.label === translateSeededLabel(field.label)
          ? field
          : { ...field, label: translateSeededLabel(field.label) },
      );
      const indexMetadatas = indexesByObjectId.get(flatObject.id) ?? [];

      const objectPermissions = getObjectPermissionsFromMapByObjectMetadataId({
        objectPermissionsByObjectMetadataId,
        objectMetadataId: flatObject.id,
      });

      const nonReadableFieldMetadataIds =
        getNonReadableFieldMetadataIdsFromObjectPermissions({
          objectPermissions,
        });

      const nonUpdatableFieldMetadataIds =
        getNonUpdatableFieldMetadataIdsFromObjectPermissions({
          objectPermissions,
        });

      return {
        ...flatObject,
        fields,
        indexMetadatas,
        searchFieldMetadatas: flatObject.searchFieldMetadatas ?? [],
        readableFields: fields.filter(
          (field) => !nonReadableFieldMetadataIds.includes(field.id),
        ),
        updatableFields: fields.filter(
          (field) => !nonUpdatableFieldMetadataIds.includes(field.id),
        ),
      } satisfies EnrichedObjectMetadataItem;
    });
  },
});
