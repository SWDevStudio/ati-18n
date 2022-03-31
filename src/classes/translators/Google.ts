import Translator from "./Translator";
import {Itranslitor} from "../../interface/Itranslitor";
import {AxiosInstance} from "axios";
import {Json} from "../../types/Json";
import axios from "axios";
import {RequestMicrosoft} from "./Microsoft";
import {replaceInterpolation} from "../../utils/intrapolation";
import {Responses} from "../../interface/Responses";
// @ts-ignore
import setPath from 'object-path-set'

export default class Google extends Translator implements Itranslitor {
  readonly axios: AxiosInstance;
  readonly name: string = 'Google';

  constructor(langFrom: string, langTo: string, targetJson: Json) {
    super(langFrom, langTo, targetJson)

    this.axios = axios.create({
      baseURL: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'Accept-Encoding': 'application/gzip',
        'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
        'X-RapidAPI-Key': 'fd3f1a1c35mshe2ea65941658536p1f6146jsn0b4018414817'
      }
    })
  }

  async translate(): Promise<Json> {

    const translateObject = this._dataGenerator()
    const response = await this.axios.post('', translateObject.encodedParams)
    const requestMicrosoft: RequestMicrosoft[]
      = translateObject.microsoftStyle.map((item, key) => ({
      key: item.key,
      text: response.data.data.translations[key].translatedText
    }))

    // Если интерполяция будет переведена переводчиком
    requestMicrosoft.forEach((item, key) => {
      requestMicrosoft[key].text = replaceInterpolation(translateObject.microsoftStyle[key].text, item.text)
    })
    return this._toJson(translateObject.microsoftStyle, requestMicrosoft)
  }

  protected _dataGenerator() {

    const encodedParams = new URLSearchParams();
    encodedParams.append("source", this.langFrom);
    encodedParams.append("target", this.langTo);

    const microsoftStyle: RequestMicrosoft[] = []
    const generator = (obj: any, key?: string) => {
      for (let item in obj) {
        if (typeof obj[item] === 'object') {
          generator(obj[item], item)
        } else {
          // Добавить к запросу.
          encodedParams.append("q", obj[item])
          microsoftStyle.push({text: obj[item], key: key ? `${key}.${item}` : item})
        }
      }
    }
    generator(this.targetJson, '')
    return {
      encodedParams,
      microsoftStyle
    }
  }

  protected _toJson(generatedData: RequestMicrosoft[], response: RequestMicrosoft[]): Json {
    const setKeyForResponse: RequestMicrosoft[] = response.map((i, k) => {
      return {
        text: i.text,
        key: generatedData[k].key
      }
    })
    const obj: Json = {}
    setKeyForResponse.forEach((i) => {
      setPath(obj, i.key, i.text)
    })
    return obj
  }

}