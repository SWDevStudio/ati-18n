import {Itranslitor} from "../interface/Itranslitor";
import Translator from "./Translator";
import axios, {AxiosInstance} from "axios";


export default class Yandex extends Translator implements Itranslitor {
  axios: AxiosInstance

  constructor(langFrom:string, langTo:string) {
    super(langFrom, langTo)
    this.axios = axios.create({})
  }



  async translate(): Promise<string> {
    return ''
  }
}