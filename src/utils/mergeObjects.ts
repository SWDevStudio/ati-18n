import {Json} from "../types/Json";

export function mergeObjects(jsons: Json[]) {
  const newJson: Json = JSON.parse(JSON.stringify(jsons[0]))

  const deepCompression = (Json: Json) => {
    for (let item in Json) {
      if (typeof Json[item] === 'object') {
        deepCompression(Json[item] as Json)
      } else {
        Json[item] = 'her'
      }
    }
  }
  deepCompression(newJson)

  console.log(newJson)
}