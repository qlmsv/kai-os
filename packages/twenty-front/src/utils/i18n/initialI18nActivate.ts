import { fromNavigator, fromStorage, fromUrl } from '@lingui/detect-locale';
import { APP_LOCALES } from 'twenty-shared/translations';
import { isDefined, isValidLocale, normalizeLocale } from 'twenty-shared/utils';
import { dynamicActivate } from '~/utils/i18n/dynamicActivate';

export const initialI18nActivate = () => {
  const urlLocale = fromUrl('locale');
  const storageLocale = fromStorage('locale');
  const navigatorLocale = fromNavigator();

  // K + AI OS is a Russian-language product, so Russian is the fallback when
  // nothing else identifies the visitor. An explicit choice — the ?locale
  // parameter, a stored preference, or the browser language — still wins.
  let locale: keyof typeof APP_LOCALES = APP_LOCALES['ru-RU'];

  const normalizedUrlLocale = isDefined(urlLocale)
    ? normalizeLocale(urlLocale)
    : null;
  const normalizedStorageLocale = isDefined(storageLocale)
    ? normalizeLocale(storageLocale)
    : null;
  const normalizedNavigatorLocale = isDefined(navigatorLocale)
    ? normalizeLocale(navigatorLocale)
    : null;

  if (isDefined(normalizedUrlLocale) && isValidLocale(normalizedUrlLocale)) {
    locale = normalizedUrlLocale;
    try {
      localStorage.setItem('locale', normalizedUrlLocale);
    } catch (error) {
      // oxlint-disable-next-line no-console
      console.log('Failed to save locale to localStorage:', error);
    }
  } else if (
    isDefined(normalizedStorageLocale) &&
    isValidLocale(normalizedStorageLocale)
  ) {
    locale = normalizedStorageLocale;
  } else if (
    isDefined(normalizedNavigatorLocale) &&
    isValidLocale(normalizedNavigatorLocale)
  ) {
    locale = normalizedNavigatorLocale;
  }

  dynamicActivate(locale);
};
