import {Json} from "../../types/Json";
import {COLOR_CONSOLE} from "../../const/COLOR_CONSOLE";
import printText from "../../utils/printText";
import Writer from "../Writer";
import {DefaultConfig} from "../../const/DEFAULT_CONFIG";
import i18n from "../i18n";

export default class Translator {
  langTo: string
  langFrom: string
  targetJson: Json
  readonly configFile: DefaultConfig | null

  constructor(langFrom: string, langTo: string, target: Json) {
    if (!langFrom) {
      printText(i18n.__('primeLanguage'), COLOR_CONSOLE.FgYellow)
    }
    this.targetJson = target
    this.langFrom = langFrom
    this.langTo = langTo
    this.configFile = new Writer().readFile('./ati-18n.config.json', true) as DefaultConfig
  }

}