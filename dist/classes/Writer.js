"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WRITER_OPTIONS_1 = require("../const/WRITER_OPTIONS");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class Writer {
    constructor(options = WRITER_OPTIONS_1.WRITER_OPTIONS) {
        // Смержим с дефолтными настройками, работает только если нет вложенности в опциях!
        options = Object.assign(Object.assign({}, WRITER_OPTIONS_1.WRITER_OPTIONS), options);
        if (!options.pathWrite)
            throw new Error('Set pathWrite in options!');
        this.pathWrite = path_1.default.normalize(options.pathWrite);
        if (!options.pathRead)
            throw new Error('Set pathRead in options!');
        this.pathRead = path_1.default.normalize(options.pathRead);
    }
    writeFile(fileName, write, extension = 'json') {
        if (!fs_1.default.existsSync(this.pathWrite)) {
            fs_1.default.mkdirSync(this.pathWrite);
        }
        fs_1.default.writeFileSync(`${this.pathWrite}/${fileName}.${extension}`, JSON.stringify(write));
    }
    readFile() {
        try {
            return JSON.parse(fs_1.default.readFileSync(this.pathRead).toString());
        }
        catch (e) {
            console.log('Файл для чтения не найден!');
            return null;
        }
    }
}
exports.default = Writer;
