export declare module Responses {
  export type Microsoft = {
    detectedLanguage: {
      language: string,
      score: 1
    },

    translations: {
      text: string,
      to: string
    }[]
  }
}