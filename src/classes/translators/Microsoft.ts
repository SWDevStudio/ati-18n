import Translator from "./Translator";
import {Itranslitor} from "../../interface/Itranslitor";
import {AxiosInstance, AxiosResponse} from "axios";
import axios from "axios";
import {Json} from "../../types/Json";
import {Responses} from "../../interface/Responses";

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

    // Возможно у некоторых API есть сразу перевод объект, что позволит не писать прослойку => нужно проверить есть ли такое в Microsoft
    const response: AxiosResponse<Responses.Microsoft[]> = await this.axios.post('/translate', this._dataGenerator())

    console.log(response.data[0].translations)
    return {}
  }

  protected _dataGenerator(): object {
    return [{text: 'Как дела 12?'}, {text: 'kotaro'}]
  }
}