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
  .command('translate <from> <to>')
  .description('Создает новый файл с текстами для перевода.')
  .action((from, to) => {
    console.log(from, to)
    const writer = new Writer({
      pathRead: './jsons/en.json'
    })


    const translators: Itranslitor[] = [
      new Google(from,to),
      new Yandex(from, to)
    ]

    const realFile = writer.readFile()

    FileGenerator(realFile, translators).then(r => {
      //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
      writer.writeFile('test', r)
    })
  })


commander.parse(process.argv)