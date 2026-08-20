import { i18n, type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { isDefined } from 'twenty-shared/utils';

// The engine seeds these labels in English and stores them in the database —
// page layout tab titles (page-layout-config utils), standard view names
// (compute-standard-*-views utils) and navigation folder names
// (STANDARD_NAVIGATION_MENU_ITEMS) — so lingui cannot discover them by
// scanning the client, and a Russian workspace rendered English tabs like
// "Opportunities". Declaring them here is what puts them in the catalogs at
// all: extract runs with --clean and drops any message missing from the source.
const SEEDED_LABEL_MESSAGES: Record<string, MessageDescriptor> = {
  'Assigned to Me': msg`Assigned to Me`,
  'By Stage': msg`By Stage`,
  'By Status': msg`By Status`,
  'Call Recordings': msg`Call Recordings`,
  Company: msg`Company`,
  List: msg`List`,
  Lists: msg`Lists`,
  Members: msg`Members`,
  Opportunities: msg`Opportunities`,
  Owner: msg`Owner`,
  Participants: msg`Participants`,
  People: msg`People`,
  'Point of Contact': msg`Point of Contact`,
  Recipients: msg`Recipients`,
  Runs: msg`Runs`,
  'Tab 1': msg`Tab 1`,
  Versions: msg`Versions`,
  Workflow: msg`Workflow`,
  Workflows: msg`Workflows`,
};

// Matching against the known set keeps user-authored names untouched, which
// also avoids feeding arbitrary text to the ICU compiler.
export const translateSeededLabel = (label: string): string => {
  const descriptor = SEEDED_LABEL_MESSAGES[label];

  return isDefined(descriptor) ? i18n._(descriptor) : label;
};
