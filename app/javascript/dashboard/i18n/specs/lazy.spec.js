import allLocales from '../index';

describe('dashboard/i18n/lazy', () => {
  let getI18n;
  let setI18nLocale;

  beforeEach(async () => {
    vi.resetModules();
    ({ getI18n, setI18nLocale } = await import('../lazy'));
  });

  it('starts with only en registered', () => {
    expect(getI18n().global.availableLocales).toEqual(['en']);
  });

  it('can load exactly the locales that i18n/index.js imports', async () => {
    const codes = Object.keys(allLocales).filter(code => code !== 'en');
    await Promise.all(codes.map(code => setI18nLocale(code)));

    const { global } = getI18n();
    expect(global.availableLocales.sort()).toEqual(
      Object.keys(allLocales).sort()
    );
    codes.forEach(code => {
      expect(global.getLocaleMessage(code)).toEqual(allLocales[code]);
    });
  });

  it('ignores an empty locale', async () => {
    await setI18nLocale('');
    await setI18nLocale(undefined);
    expect(getI18n().global.locale.value).toBe('en');
  });

  it('lets the latest call win while an earlier locale is still loading', async () => {
    const slow = setI18nLocale('ja');
    const fast = setI18nLocale('en');
    await Promise.all([slow, fast]);
    expect(getI18n().global.locale.value).toBe('en');
  });
});
