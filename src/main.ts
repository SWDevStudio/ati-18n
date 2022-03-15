import { program } from 'commander'
import { prompt } from 'inquirer'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import Microsoft from "./classes/translators/Microsoft";
import {Json} from "./types/Json";
import {COLOR_CONSOLE} from "./const/COLOR_CONSOLE";

const commander = program
commander
  .version('1.0.0')
  .description('Котики захватят мир')

commander
  .command('translate <from> <to>')
  .description('Создает новый файл с текстами для перевода.')
  .option('--read <value>', 'На основании какого файла переводим')
  .option('--patch-write <value>', 'папка в которую записываем')
  .option('--filename <value>', 'имя файла при сохранении')
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
      // TODO интерполяция не работает {{ name }} - на выходе получаем {{ имя }} ожидаем {{ name }}
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