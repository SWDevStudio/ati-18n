export const DEFAULT_CONFIG = {
  from: "en",
  to: ["ru", "de"],
  read: "./locales/en.json",
  patchWrite: "./locales",
  translatorKeys: {
    microsoft: "fd3f1a1c35mshe2ea65941658536p1f6146jsn0b4018414817"
  }
}


export type DefaultConfig = typeof DEFAULT_CONFIG