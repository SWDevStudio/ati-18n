import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

export default class Translator {
  langTo: string
  langFrom: string

  constructor(langFrom: string, langTo: string) {
    this.langFrom = langFrom
    this.langTo = langTo
  }

}