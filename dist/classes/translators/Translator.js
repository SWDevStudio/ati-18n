"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const COLOR_CONSOLE_1 = require("../../const/COLOR_CONSOLE");
const printText_1 = __importDefault(require("../../utils/printText"));
const Writer_1 = __importDefault(require("../Writer"));
class Translator {
    constructor(langFrom, langTo, target) {
        if (!langFrom) {
            (0, printText_1.default)('Исходный язык будет определен автоматически! Пример => translate -f ru', COLOR_CONSOLE_1.COLOR_CONSOLE.FgYellow);
        }
        this.targetJson = target;
        this.langFrom = langFrom;
        this.langTo = langTo;
        this.configFile = new Writer_1.default().readFile('./ati-18n.config.json', true);
    }
}
exports.default = Translator;
