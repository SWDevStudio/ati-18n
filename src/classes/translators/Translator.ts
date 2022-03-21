import {Json} from "../../types/Json";
import {COLOR_CONSOLE} from "../../const/COLOR_CONSOLE";
import printText from "../../utils/printText";

export default class Translator {
  langTo: string
  langFrom: string
  targetJson: Json

  constructor(langFrom: string, langTo: string, target: Json) {
    if (!langFrom) {
      printText('Исходный язык будет определен автоматически! Пример => translate -f ru', COLOR_CONSOLE.FgYellow)
    }
    this.targetJson = target
    this.langFrom = langFrom
    this.langTo = langTo
  }

}