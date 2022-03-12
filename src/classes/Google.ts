import Translator from "./Translator";
import {Itranslitor} from "../interface/Itranslitor";
import {AxiosInstance} from "axios";
import axios from "axios";

export default class Google extends Translator implements Itranslitor{
  axios: AxiosInstance

  constructor(langFrom: string, langTo: string) {
    super(langFrom, langTo)
    this.axios = axios.create({})
  }


  async translate(): Promise<string> {
    return ''
  }
}