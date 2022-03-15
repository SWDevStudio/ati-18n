import { program } from 'commander'
import { prompt } from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import FileGenerator from "./utils/FileGenerator";
import Microsoft from "./classes/translators/Microsoft";
import {Json} from "./types/Json";

const commander = program
commander
  .version('1.0.0')
  .description('Котики захватят мир')

commander
  .command('translate <from> <to>')
  .description('Создает новый файл с текстами для перевода.')
  .action(async (from, to) => {
    const writer = new Writer({
      pathRead: './jsons/en.json'
    })

    const realFile = writer.readFile()

    const translators: Itranslitor[] = [
      new Microsoft(from, to, realFile)
    ]

    const result: Json[] = await Promise.all(
      translators.map(i => i.translate())
    )

    //
    // const file = await FileGenerator(realFile, translators)
    //
    // //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
    writer.writeFile('test', result[0])

  })


commander.parse(process.argv)