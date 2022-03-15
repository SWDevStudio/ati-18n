import {WRITER_OPTIONS} from "../const/WRITER_OPTIONS";
import {Json} from "../types/Json";
import fs from 'fs';
import path from 'path'

export default class Writer {
  readonly pathWrite: string
  readonly pathRead: string

  constructor(options =  WRITER_OPTIONS) {
    // Смержим с дефолтными настройками, работает только если нет вложенности в опциях!
    options = {...WRITER_OPTIONS, ...options}

    if (!options.pathWrite) throw new Error('Set pathWrite in options!')
    this.pathWrite = path.normalize(options.pathWrite)

    if (!options.pathRead) throw new Error('Set pathRead in options!')
    this.pathRead = path.normalize(options.pathRead)
  }

  writeFile(fileName: string, write: Json, extension = 'json'): void {
    if (!fs.existsSync(this.pathWrite)) {
      fs.mkdirSync(this.pathWrite);
    }

    fs.writeFileSync(`${this.pathWrite}/${fileName}.${extension}`, JSON.stringify(write))
  }

  readFile(): Json | null {
    try {
      return JSON.parse(fs.readFileSync(this.pathRead).toString())
    } catch (e) {
      console.log('Файл для чтения не найден!')
      return null
    }
  }

}