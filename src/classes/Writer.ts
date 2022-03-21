import {WRITER_OPTIONS} from "../const/WRITER_OPTIONS";
import {Json} from "../types/Json";
import fs from 'fs';
import path from 'path'
import printText from "../utils/printText";
import {COLOR_CONSOLE} from "../const/COLOR_CONSOLE";
import inquirer from "inquirer";
import generateHash from "../utils/generateHash";

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

  async writeFile(fileName: string, write: Json, extension = 'json'): Promise<void> {
    if (!fs.existsSync(this.pathWrite)) {
      fs.mkdirSync(this.pathWrite);
    }

    const existFile = fs.existsSync(`${this.pathWrite}/${fileName}.${extension}`)
    if (existFile) {

      const { rewrite } = await inquirer.prompt([
        { type: 'list', name: 'rewrite', message: `Файл ${fileName}.${extension} уже существует, перезаписать?`, choices: ['yes', 'no'] }
      ])

      if (rewrite === 'no') {
        const hash = generateHash(6)
        fs.writeFileSync(`${this.pathWrite}/${fileName}.${hash}.${extension}`, JSON.stringify(write))
        printText(`Файл создан под именем ${fileName}.${hash}.${extension}`, COLOR_CONSOLE.FgGreen)
        return
      }
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
        printText('Файл для чтения не найден!', COLOR_CONSOLE.FgRed)
        printText(e)
      }
      return null
    }
  }

}