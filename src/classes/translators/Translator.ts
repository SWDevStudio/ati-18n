import {Json} from "../../types/Json";
import {COLOR_CONSOLE} from "../../const/COLOR_CONSOLE";
import printText from "../../utils/printText";
import Writer from "../Writer";
import {DefaultConfig} from "../../const/DEFAULT_CONFIG";
import {I18n} from "i18n";
import path from "path";

const i18n = new I18n()
i18n.configure(({
  locales: ['ru', 'de', 'en'],
  defaultLocale: 'en',
  directory: path.join(__dirname, '/locales')
}))

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