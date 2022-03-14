import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {Json} from "../../types/Json";

export default class Translator {
  langTo: string
  langFrom: string
  targetJson: Json

  constructor(langFrom: string, langTo: string, target: Json) {
    this.targetJson = target
    this.langFrom = langFrom
    this.langTo = langTo
  }

}