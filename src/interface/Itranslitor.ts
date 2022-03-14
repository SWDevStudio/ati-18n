import {AxiosInstance} from "axios";
import {Json} from "../types/Json";

export interface Itranslitor {
  readonly axios: AxiosInstance
  readonly name: string

  translate(): Promise<Json>
}