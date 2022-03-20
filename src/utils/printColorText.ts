import {COLOR_CONSOLE} from "../const/COLOR_CONSOLE";

export default function printColorText(str: any, color?: COLOR_CONSOLE) {
  if (color) {
    console.log(color)
  }
  console.log(str)

  if (color) {
    // Делает цвет дефолтным
    console.log('\x1b[0m')
  }

}