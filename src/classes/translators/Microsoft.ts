import Translator from "./Translator";
import {Itranslitor} from "../../interface/Itranslitor";
import {AxiosInstance, AxiosResponse} from "axios";
import axios from "axios";
import {Json} from "../../types/Json";
import {Responses} from "../../interface/Responses";
// @ts-ignore
import setPath from 'object-path-set'
type RequestMicrosoft = {
  text: string
  key: string
}

export default class Microsoft extends Translator implements Itranslitor {
  axios: AxiosInstance;
  name: string = 'Microsoft';

  constructor(langFrom: string, langTo: string, targetJson: Json) {
    super(langFrom, langTo, targetJson)
    this.axios = axios.create({
      baseURL: 'https://microsoft-translator-text.p.rapidapi.com',
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
        'x-rapidapi-key': 'fd3f1a1c35mshe2ea65941658536p1f6146jsn0b4018414817'
      },
      params: {
        'api-version': '3.0',
        from: langFrom,
        to: langTo,
        textType: 'plain',
        profanityAction: 'NoAction'
      }
    })
  }

  async translate(): Promise<Json> {
    // У нас есть Json объект в котором есть объект с любой вложенностью.
    // Нужно сгенерировать data объект для API
    // После чего нужно получить ответ и собрать объект заново.
    // Далее возвращаем объект в едином виде для всего.
    const translateObject: RequestMicrosoft[] = this._dataGenerator()

    // Возможно у некоторых API есть сразу перевод объект, что позволит не писать прослойку => нужно проверить есть ли такое в Microsoft
    const response: AxiosResponse<Responses.Microsoft[]> = await this.axios.post('/translate', translateObject)
    const needArr = response.data.map(i => i.translations).flat()
    return this._toJson(translateObject, needArr)
  }


  protected _dataGenerator(): RequestMicrosoft[] {
    const arr: RequestMicrosoft[] = []
    const generator = (obj: any, key?: string) => {
      for (let item in obj) {
        if (typeof obj[item] === 'object') {
          generator(obj[item], item)
        } else {
          arr.push({text: obj[item], key: key ? `${key}.${item}` : item})
        }
      }
    }
    generator(this.targetJson, '')
    return arr
  }

  protected _toJson(generatedData: RequestMicrosoft[], response: Responses.Microsoft['translations']): Json {
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

  // GetByPath(obj: any, path: any) {
  //   let parts = path.split(".");
  //   let current = obj;
  //   for (let i = 0; i < parts.length; i++) {
  //     current = current[parts[i]];
  //     if (!current)
  //       break;
  //   }
  //   return current;
  // }
}