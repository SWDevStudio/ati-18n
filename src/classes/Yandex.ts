import {Itranslitor} from "../interface/Itranslitor";
import Translator from "./Translator";
import axios, {AxiosInstance} from "axios";


export default class Yandex extends Translator implements Itranslitor {
  axios: AxiosInstance
  name = 'Yandex'

  constructor(langFrom:string, langTo:string) {
    super(langFrom, langTo)
    this.axios = axios.create({})
  }



  async translate(string:string): Promise<{translator: string, value: string}> {
    return {
      translator: this.name,
      value: string
    }
  }
}