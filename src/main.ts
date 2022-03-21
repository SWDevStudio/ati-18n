#!/usr/bin/env node
import {program} from 'commander'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import Microsoft from "./classes/translators/Microsoft";
import {Json} from "./types/Json";
import {COLOR_CONSOLE} from "./const/COLOR_CONSOLE";
import printText from "./utils/printText";
import {DEFAULT_CONFIG} from "./const/DEFAULT_CONFIG";

const commander = program
commander
  .version('1.0.5')
  .description('Скриптовый перевод JSON файлов, при помощи API переводчиков.')

commander
  .command('translate')
  .description('Создает новый файл с текстами для перевода.')
  .option('--from <value>', 'С какого языка переводится')
  .option('--to <value>', 'На какой язык нужен перевод')
  .option('-r, --read <value>', 'Путь к файлу который нужно перевести. Пример => ./locales/en.json')
  .option('-w, --patch-write <value>', 'Путь к папке, в которую будет записан файл. Пример => ./locales')
  .option('--filename <value>', 'Имя файла при сохранении. По умолчанию выбранный язык.')
  .action(async (args) => {

    const configFile = new Writer().readFile('./ati-18n.config.json', true)
    let ctx = args
    if (configFile) {
      ctx = {
        ...configFile,
        ...ctx
      }
    }

    const startTranslate = async (lang: string) => {
      if (!ctx.read) {
        if (!ctx.from) {
          printText('Укажите файл для чтения! Пример => --read ./locales/*.json')
          return
        } else {
          printText(`Файл для чтения не указан, попытка найти ./locales/${ctx.from}.json`)
          return
        }
      }

      //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
      if (!ctx.patchWrite)
        printText('Не указана папка в которую нужно записывать файл, по дефолту выбрана папка ./locales')

      const writer = new Writer({
        pathRead: ctx.read || `./locales/${ctx.from}.json`,
        pathWrite: ctx.patchWrite || './locales'
      })

      const realFile = writer.readFile()

      if (realFile) {
        const translators: Itranslitor[] = [
          new Microsoft(ctx.from, lang, realFile)
        ]

        // TODO сделать перевод и сравнение результатов с нескольких переводчиков
        const result: Json[] = await Promise.all(
          translators.map(i => i.translate())
        )


        try {
          writer.writeFile(lang, result[0])
          printText('Файл успешно записан', COLOR_CONSOLE.FgGreen)
        } catch (e) {
          printText(e, COLOR_CONSOLE.FgRed)
        }
      }
    }


    if (Array.isArray(ctx.to)) {
      ctx.to.forEach((i: string) => startTranslate(i))
    } else {
      startTranslate(ctx.to)
    }
  })


commander
  .command('generate-config')
  .description('Создает дефолтный конфигурационный файл для программы')
  .action(() => {
    const writer = new Writer({
      pathWrite: './',
    })

    try {
      writer.writeFile('ati-18n.config', DEFAULT_CONFIG)
      printText('Создан базовый конфигурационный файл', COLOR_CONSOLE.FgGreen)
    } catch (e) {
      printText('Не удалось, создать конфигурационный файл', COLOR_CONSOLE.FgRed)
      printText(e)
    }
  })


commander.parse(process.argv)