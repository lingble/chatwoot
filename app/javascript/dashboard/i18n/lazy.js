import { createI18n } from 'vue-i18n';
import en from './locale/en';

// Only `en` ships in the entry bundle. Every other locale is its own chunk,
// fetched the first time that locale is selected. Keep this list in sync with
// the imports in ./index.js (folders outside it are partial Crowdin syncs).
const loaders = import.meta.glob(
  './locale/{ar,bg,ca,cs,da,de,el,es,et,fa,fi,fr,he,hi,hu,id,is,it,ja,ko,lt,lv,ml,nl,no,pl,pt,pt_BR,ro,ru,sk,sl,sr,sv,ta,th,tr,uk,uz,vi,zh_CN,zh_TW}/index.js',
  { import: 'default' }
);

let i18n;

// Created on first use so that importing this module has no side effects.
export const getI18n = () => {
  i18n ||= createI18n({
    legacy: false, // https://github.com/intlify/vue-i18n/issues/1902
    locale: 'en',
    messages: { en },
  });
  return i18n;
};

export async function setI18nLocale(locale) {
  if (!locale) return;
  const { global } = getI18n();
  const load = loaders[`./locale/${locale}/index.js`];
  if (load && !global.availableLocales.includes(locale)) {
    try {
      global.setLocaleMessage(locale, await load());
    } catch (error) {
      // The chunk failed to download: stay in the current language instead of
      // failing the caller (e.g. a successful account update shown as an error).
      return;
    }
  }
  global.locale.value = locale;
}
