"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function printColorText(str, color) {
    if (color) {
        console.log(color);
    }
    console.log(str);
    if (color) {
        // Делает цвет дефолтным
        console.log('\x1b[0m');
    }
}
exports.default = printColorText;
