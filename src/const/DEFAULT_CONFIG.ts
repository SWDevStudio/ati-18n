export const DEFAULT_CONFIG: any = {
  from: "en",
  to: ["ru", "de"],
  read: "./locales/en.json",
  patchWrite: "./locales",
  printTranslateError: false,
  programLanguage: "ru",
  translatorKeys: {}
}


export type DefaultConfig = typeof DEFAULT_CONFIG