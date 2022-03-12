import {AxiosInstance} from "axios";

export interface Itranslitor {
  axios: AxiosInstance
  translate(): Promise<any>
}