import {Itranslitor} from "../interface/Itranslitor";
import Google from "./Google";
import {WRITER_OPTIONS} from "../const/WRITER_OPTIONS";
export default class Writer {
  readonly pathWrite: string
  readonly pathRead: string
  readonly translators: Itranslitor[] = []

  constructor(langFrom: string, langTo: string, options =  WRITER_OPTIONS) {
    // Смержим с дефолтными настройками, работает только если нет вложенности в опциях!
    options = {...WRITER_OPTIONS, ...options}

    if (!options.pathWrite) throw new Error('Set pathWrite in options!')
    this.pathWrite = options.pathWrite

    if (!options.pathRead) throw new Error('Set pathRead in options!')
    this.pathRead = options.pathRead


    this.translators.push(new Google(langFrom, langTo))
  }

  writeFile(): void {

  }

  readFile(): void {

  }

}