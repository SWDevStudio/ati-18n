import {WRITER_OPTIONS} from "../const/WRITER_OPTIONS";
import {Json} from "../types/Json";
import fs from 'fs';
import path from 'path'
import printColorText from "../utils/printColorText";
import {COLOR_CONSOLE} from "../const/COLOR_CONSOLE";

export default class Writer {
  readonly pathWrite: string
  readonly pathRead?: string

  constructor(options =  WRITER_OPTIONS) {
    // Смержим с дефолтными настройками, работает только если нет вложенности в опциях!
    options = {...WRITER_OPTIONS, ...options}

    if (!options.pathWrite) throw new Error('Set pathWrite in options!')
    this.pathWrite = path.normalize(options.pathWrite)

    if (options.pathRead) {
      this.pathRead = path.normalize(options.pathRead)
    }

  }

  writeFile(fileName: string, write: Json, extension = 'json'): void {
    if (!fs.existsSync(this.pathWrite)) {
      fs.mkdirSync(this.pathWrite);
    }

    fs.writeFileSync(`${this.pathWrite}/${fileName}.${extension}`, JSON.stringify(write))
  }

  readFile(pathRead?: string, softReading?: boolean): Json | null {
    try {
      if (!pathRead && !this.pathRead) {
        throw new Error('Укажите путь для чтения!')
      }
      return JSON.parse(fs.readFileSync(pathRead || this.pathRead || '').toString())
    } catch (e) {
      if (!softReading) {
        printColorText('Файл для чтения не найден!', COLOR_CONSOLE.FgRed)
        console.error(e)
      }
      return null
    }
  }

}