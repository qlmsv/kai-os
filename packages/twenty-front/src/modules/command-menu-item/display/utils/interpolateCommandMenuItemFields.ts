import { translateStandardCommandMenuItemLabel } from '@/command-menu-item/display/utils/translateStandardCommandMenuItemLabel';
import { type CommandMenuContextApi, type Nullable } from 'twenty-shared/types';
import {
  interpolateCommandMenuItemTemplate,
  isDefined,
} from 'twenty-shared/utils';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

type InterpolatedCommandMenuItemFields = {
  iconKey: Nullable<string>;
  label: string;
  shortLabel: Nullable<string>;
};

const OBJECT_LABEL_EXPRESSION_PATTERN = /\$\{[^{}]+\}/;

// A seeded label looks like "Update ${capitalize(objectMetadataItem.labelPlural)}".
// Resolving the expression on its own gives the object label, which the
// translated message then interpolates — that keeps the verb translatable
// instead of baking it into the final string.
const resolveObjectLabel = (
  rawLabel: Nullable<string>,
  context: CommandMenuContextApi,
): string => {
  const expression = rawLabel?.match(OBJECT_LABEL_EXPRESSION_PATTERN)?.[0];

  if (!isDefined(expression)) {
    return '';
  }

  return interpolateCommandMenuItemTemplate({ label: expression, context }) ?? '';
};

const resolveField = (
  rawLabel: Nullable<string>,
  context: CommandMenuContextApi,
): Nullable<string> => {
  const interpolated = interpolateCommandMenuItemTemplate({
    label: rawLabel,
    context,
  });

  if (!isDefined(rawLabel)) {
    return interpolated;
  }

  const objectLabel = resolveObjectLabel(rawLabel, context);

  // An unresolved expression yields an empty string, which would render
  // "Изменить: " with nothing after it — keep the plain interpolation then.
  if (objectLabel === '') {
    return interpolated;
  }

  return translateStandardCommandMenuItemLabel(rawLabel, objectLabel) ?? interpolated;
};

export const interpolateCommandMenuItemFields = (
  item: CommandMenuItemFieldsFragment,
  commandMenuContextApi: CommandMenuContextApi,
): InterpolatedCommandMenuItemFields => {
  const iconKey = interpolateCommandMenuItemTemplate({
    label: item.icon,
    context: commandMenuContextApi,
  });

  const label = resolveField(item.label, commandMenuContextApi) ?? item.label;

  const shortLabel = resolveField(item.shortLabel, commandMenuContextApi);

  return { iconKey, label, shortLabel };
};
