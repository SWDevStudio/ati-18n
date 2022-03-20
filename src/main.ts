#!/usr/bin/env node
import { program } from 'commander'
import { prompt } from 'inquirer'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import Microsoft from "./classes/translators/Microsoft";
import {Json} from "./types/Json";
import {COLOR_CONSOLE} from "./const/COLOR_CONSOLE";

const commander = program
commander
  .version('1.0.1')
  .description('Скриптовый перевод JSON файлов, при помощи API переводчиков.')

commander
  .command('translate <from> <to>')
  .description('Создает новый файл с текстами для перевода.')
  .option('--read <value>', 'Путь к файлу который нужно перевести. Пример => ./locales/en.json')
  .option('--patch-write <value>', 'Путь к папке, в которую будет записан файл. Пример => ./locales')
  .option('--filename <value>', 'имя файла при сохранении. По умолчанию выбранный язык.')
  .action(async (from, to, options) => {
    if (!options.read) {
      console.log(`Файл для чтения не указан, попытка найти ./locales/${from}.json`)
    }


    const writer = new Writer({
      pathRead: options.read || `./locales/${from}.json`,
      pathWrite: options.patchWrite || './locales'
    })
    const realFile = writer.readFile()

    if (realFile) {
      const translators: Itranslitor[] = [
        new Microsoft(from, to, realFile)
      ]

      // TODO сделать перевод и сравнение результатов с нескольких переводчиков
      const result: Json[] = await Promise.all(
        translators.map(i => i.translate())
      )

      //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
      if (!options.patchWrite)
        console.log('Не указана папка в которую нужно записывать файл, по дефолту выбрана папка ./locales')
      try {
        writer.writeFile(options.filename || to, result[0])
        console.log(COLOR_CONSOLE.FgGreen, 'Файл успешно записан')
      } catch (e) {
        console.log(COLOR_CONSOLE.FgRed, e)
      }
    }
  })


commander.parse(process.argv)