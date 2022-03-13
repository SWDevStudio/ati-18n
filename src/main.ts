import { program } from 'commander'
import { prompt } from 'inquirer'
import chalk from 'chalk'
import fs from 'fs'
import Writer from "./classes/Writer";
import {Itranslitor} from "./interface/Itranslitor";
import Google from "./classes/Google";
import Yandex from "./classes/Yandex";

const commander = program
commander
  .version('1.0.0')
  .description('Котики захватят мир')

commander
  .command('create <name>')
  .option('--extension <value>', 'File extension')
  .alias('c')
  .description('Котики захватят мир')
  .action((name, cmd) => {
    if (
      cmd.extension &&
      !['json', 'txt', 'cfg'].includes(cmd.extension)
    ) {
      console.log(chalk.red('\nExtension is not allowed.'))
    } else {
      prompt([
        {
          type: 'input',
          name: 'charset',
          message: 'Charset: ',
        },
        {
          type: 'input',
          name: 'max_ram_usage',
          message: 'Max RAM usage, Mb: ',
        },
        {
          type: 'input',
          name: 'max_cpu_usage',
          message: 'Max CPU usage, %: ',
        },
        {
          type: 'input',
          name: 'check_updates_interval',
          message: 'Updates interval, ms: ',
        },
        {
          type: 'input',
          name: 'processes_count',
          message: 'Processes count: ',
        },
      ]).then((options) => {
        if (cmd.extension && cmd.extension === 'json') {
          fs.writeFileSync(
            `${name}.${cmd.extension}`,
            JSON.stringify(options)
          )
        } else {
          let data = ''
          for (let item in options)
            data += `${item}=${options[item]} \n`

          fs.writeFileSync(`${name}.cfg`, data)
        }
        console.log(
          chalk.green(
            `\nFile "${name}.${
              cmd.extension || 'cfg'
            }" created.`
          )
        )
      })
    }
  })


commander
  .command('translate')
  .action(() => {
    const from = 'eu'
    const to = 'ru'

    const writer = new Writer({
      pathRead: './jsons/en.json'
    })


    const translators: Itranslitor[] = [
      new Google(from,to),
      new Yandex(from, to)
    ]

    // Теперь нужно пройтись по JSON файлу рекурсивно и заменить все значения в ключах.
    const realFile = writer.readFile()
    const fileGenerator = async (object: any) => {
      const file: any = {}

      const ignoredWord = '%'
      const startInterpolation = '{{'
      const endInterpolation = '}}'

      for (let item in object) {
        if ( typeof object[item] === 'object') {
          file[item] = await fileGenerator(object[item])
        } else {
          const str: string = object[item]

          const translates = await Promise.all(translators.map(i => i.translate(str)))
          const coincidence = (arr: string[]) => [...new Set(translates.map(i => i.value))]
          const isNotCoincidence = coincidence(translates)

          // Проверить расхождение переводов если различаются,
          if (isNotCoincidence.length > 1) {
            const response = await prompt({
              type: 'list',
              message: 'Конфликт переводов, выберете подходящий для вас',
              name: 'selected',
              choices: translates.map(i => `${i.translator}: ${i.value}`),
            })

            // проработать если не один вариант не нравится.
          }

          file[item] = str
        }
      }

      return file
    }

    fileGenerator(realFile).then(r => {
      writer.writeFile('test', r)
    })
  })


commander.parse(process.argv)