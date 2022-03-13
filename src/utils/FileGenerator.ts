import {prompt} from "inquirer";
import {Itranslitor} from "../interface/Itranslitor";

export default async function FileGenerator(object: any, translators: Itranslitor[])  {
  const file: any = {}

  const ignoredWord = '%'
  const startInterpolation = '{{'
  const endInterpolation = '}}'

  for (let item in object) {
    if ( typeof object[item] === 'object') {
      file[item] = await FileGenerator(object[item], translators)
    } else {
      let str: string = object[item]

      const translates = await Promise.all(translators.map(i => i.translate(str)))
      const coincidence = (arr: string[]) => [...new Set(translates.map(i => i.value))]
      const isNotCoincidence = coincidence(translates)

      // Проверить расхождение переводов если различаются,
      if (isNotCoincidence.length > 1) {
        const customTranslate = 'Свой вариант'
        const response = await prompt({
          type: 'list',
          message: 'Конфликт переводов, выберете подходящий для вас',
          name: 'selected',
          choices: [...translates.map(i => `${i.translator}: ${i.value}`), customTranslate],
        })



        if (response.selected === customTranslate) {
          const response = await prompt({
            type: 'input',
            message: 'Введите свой вариант:',
            name: 'input'
          })

          str = response.input
        } else {
          str = response.selected
        }
        // проработать если не один вариант не нравится.
      }

      file[item] = str
    }
  }

  return file
}