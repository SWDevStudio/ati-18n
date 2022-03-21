"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WRITER_OPTIONS_1 = require("../const/WRITER_OPTIONS");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const printText_1 = __importDefault(require("../utils/printText"));
const COLOR_CONSOLE_1 = require("../const/COLOR_CONSOLE");
class Writer {
    constructor(options = WRITER_OPTIONS_1.WRITER_OPTIONS) {
        // Смержим с дефолтными настройками, работает только если нет вложенности в опциях!
        options = Object.assign(Object.assign({}, WRITER_OPTIONS_1.WRITER_OPTIONS), options);
        if (!options.pathWrite)
            throw new Error('Set pathWrite in options!');
        this.pathWrite = path_1.default.normalize(options.pathWrite);
        if (options.pathRead) {
            this.pathRead = path_1.default.normalize(options.pathRead);
        }
    }
    writeFile(fileName, write, extension = 'json') {
        if (!fs_1.default.existsSync(this.pathWrite)) {
            fs_1.default.mkdirSync(this.pathWrite);
        }
        fs_1.default.writeFileSync(`${this.pathWrite}/${fileName}.${extension}`, JSON.stringify(write));
    }
    readFile(pathRead, softReading) {
        try {
            if (!pathRead && !this.pathRead) {
                throw new Error('Укажите путь для чтения!');
            }
            return JSON.parse(fs_1.default.readFileSync(pathRead || this.pathRead || '').toString());
        }
        catch (e) {
            if (!softReading) {
                (0, printText_1.default)('Файл для чтения не найден!', COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
                (0, printText_1.default)(e);
            }
            return null;
        }
    }
}
exports.default = Writer;
