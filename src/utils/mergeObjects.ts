import {Json} from "../types/Json";
import {prompt} from "inquirer";
import {I18n} from "i18n";
import path from "path";

const i18n = new I18n()
i18n.configure(({
  locales: ['ru', 'de', 'en'],
  defaultLocale: 'ru',
  directory: path.join(__dirname, '/locales')
}))


export async function mergeObjects(jsons: Json[], realFile: Json) {
  const newJson: Json = JSON.parse(JSON.stringify(jsons[0]))

  const deepCompression = async (Json: Json, nesting: Json[], realFile: Json) => {
    for (let item in Json) {
      if (typeof Json[item] === 'object') {
       await deepCompression(Json[item] as Json, nesting.map((i: any) => i[item]), realFile[item] as Json)
      } else {
        const translateCollections = Array.from(new Set([Json[item], ...nesting.map(i => i[item])]))
        if (translateCollections.length >= 2) {
          const {response} = await prompt({
            type: 'list',
            name: 'response',
            message: i18n.__('failMergeObject', { text: realFile[item]} as {text: string}),
            choices: [
              ...translateCollections.map(item => ({
                name: `${item}`,
                value: item
              })),
              {
                name: i18n.__('yourChoice'),
                value: 'custom'
              }
            ],
          })

          if (response === 'custom') {
            const {customVariant} = await prompt({
              type: 'input',
              message: i18n.__('writeYourChoice'),
              name: 'customVariant'
            })
            Json[item] = customVariant
          } else {
            Json[item] = response
          }
        }
      }
    }
  }
  await deepCompression(newJson, jsons, realFile)

  // console.log(newJson)
  return newJson
}