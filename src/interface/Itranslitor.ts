import {AxiosInstance} from "axios";

export interface Itranslitor {
  axios: AxiosInstance
  name: string
  translate(string: string): Promise<any>
}