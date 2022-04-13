#!/usr/bin/env node
import {program} from 'commander'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import Microsoft from "./classes/translators/Microsoft";
import {Json} from "./types/Json";
import {COLOR_CONSOLE} from "./const/COLOR_CONSOLE";
import printText from "./utils/printText";
import {DEFAULT_CONFIG} from "./const/DEFAULT_CONFIG";
import {prompt} from "inquirer";
import Google from "./classes/translators/Google";
import {mergeObjects} from "./utils/mergeObjects";
import i18n from "./classes/i18n";


const commander = program
commander
  .version('1.3.0')
  .description(i18n.__('descriptionCLI'))

commander
  .command('translate')
  .description(i18n.__('descriptionCLI'))
  .option('--from <value>', i18n.__('fromLanguage'))
  .option('--to <value>', i18n.__('toLanguage'))
  .option('-r, --read <value>', i18n.__('read'))
  .option('-w, --patch-write <value>', i18n.__('write'))
  .option('--filename <value>', i18n.__('filename'))
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
          printText(i18n.__('errorReadFile'))
          return
        } else {
          printText(i18n.__('findReadFile', {from: ctx.from}))
          return
        }
      }

      if (!ctx.patchWrite)
        printText(i18n.__('errorFolder'))

      const writer = new Writer({
        pathRead: ctx.read || `./locales/${ctx.from}.json`,
        pathWrite: ctx.patchWrite || './locales'
      })

      const realFile = writer.readFile()

      if (realFile) {
        const translators: Itranslitor[] = [
          new Microsoft(ctx.from, lang, realFile),
          new Google(ctx.from, lang, realFile)
        ]

        const result: Json[] = []

        for (let translator of translators) {
          try {
            result.push(await translator.translate())
          } catch (e: any) {
            if (ctx.printTranslateError) {
              printText(i18n.__('whatError', {name: translator.name, lang}), COLOR_CONSOLE.FgRed)
              const {response} = await prompt<{response: 'yes' | 'no'}>({
                type: 'list', name: 'response', message: i18n.__('findDetails'), choices: ['yes', 'no']
              })
              if (response === 'yes') {
                console.log(e)
              }
            }
            //TODO добавить возможность записывать логи программы в отдельный файл, что бы их можно было посмотреть.
          }
        }

        try {
          await writer.writeFile(lang, result.length >= 2 ? await mergeObjects(result, realFile) : result[0])
          printText(i18n.__('successWrite'), COLOR_CONSOLE.FgGreen)
        } catch (e) {
          printText(e, COLOR_CONSOLE.FgRed)
        }
      }
    }


    if (Array.isArray(ctx.to)) {
      for (let i of ctx.to) {
        await startTranslate(i)
      }
    } else {
      await startTranslate(ctx.to)
    }
  })


commander
  .command('generate-config')
  .description(i18n.__('generateConfigDescription'))
  .action(async () => {
    const writer = new Writer({
      pathWrite: './',
    })

    try {
      await writer.writeFile('ati-18n.config', DEFAULT_CONFIG)
      printText(i18n.__('createConfigFile'), COLOR_CONSOLE.FgGreen)
    } catch (e) {
      printText(i18n.__('failCreateConfigFile'), COLOR_CONSOLE.FgRed)
      printText(e)
    }
  })

// TODO  добавить метод который будет генерировать enum файл с ключами для перевода (возможно)


commander.parse(process.argv)