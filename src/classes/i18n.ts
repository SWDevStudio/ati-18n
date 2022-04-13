import {I18n} from "i18n";
import path from "path";
import Writer from "./Writer";
import fs from "fs";

const configFile: any = fs.readFileSync('./ati-18n.config.json').toString()

const i18n = new I18n()
i18n.configure(({
  locales: ['ru', 'de', 'en'],
  defaultLocale: JSON.parse(configFile)?.programLanguage || 'en',
  directory: path.join(__dirname, '../locales')
}))

export default i18n