import { program } from 'commander'
import { prompt } from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import Google from "./classes/Google";
import Yandex from "./classes/Yandex";
import FileGenerator from "./utils/FileGenerator";

const commander = program
commander
  .version('1.0.0')
  .description('Котики захватят мир')

commander
  .command('translate <from> <to>')
  .description('Создает новый файл с текстами для перевода.')
  .action(async (from, to) => {
    console.log(from, to)
    const writer = new Writer({
      pathRead: './jsons/en.json'
    })


    const translators: Itranslitor[] = [
      new Google(from,to),
      new Yandex(from, to)
    ]

    const realFile = writer.readFile()

    const file = await FileGenerator(realFile, translators)

    //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
    writer.writeFile('test', file)

  })


commander.parse(process.argv)