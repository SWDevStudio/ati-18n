"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const WRITER_OPTIONS_1 = require("../const/WRITER_OPTIONS");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const printText_1 = __importDefault(require("../utils/printText"));
const COLOR_CONSOLE_1 = require("../const/COLOR_CONSOLE");
const inquirer_1 = __importDefault(require("inquirer"));
const generateHash_1 = __importDefault(require("../utils/generateHash"));
const i18n_1 = __importDefault(require("./i18n"));
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!fs_1.default.existsSync(this.pathWrite)) {
                fs_1.default.mkdirSync(this.pathWrite);
            }
            const existFile = fs_1.default.existsSync(`${this.pathWrite}/${fileName}.${extension}`);
            if (existFile) {
                const { rewrite } = yield inquirer_1.default.prompt([
                    { type: 'list', name: 'rewrite', message: i18n_1.default.__('fileIsExist', { fileName, extension }), choices: ['yes', 'no'] }
                ]);
                if (rewrite === 'no') {
                    const hash = (0, generateHash_1.default)(6);
                    fs_1.default.writeFileSync(`${this.pathWrite}/${fileName}.${hash}.${extension}`, JSON.stringify(write));
                    (0, printText_1.default)(i18n_1.default.__('fileCreateForName', { fileName, hash, extension }), COLOR_CONSOLE_1.COLOR_CONSOLE.FgGreen);
                    return;
                }
            }
            fs_1.default.writeFileSync(`${this.pathWrite}/${fileName}.${extension}`, JSON.stringify(write));
        });
    }
    readFile(pathRead, softReading) {
        try {
            if (!pathRead && !this.pathRead) {
                throw new Error(i18n_1.default.__('setReadFile'));
            }
            return JSON.parse(fs_1.default.readFileSync(pathRead || this.pathRead || '').toString());
        }
        catch (e) {
            if (!softReading) {
                (0, printText_1.default)(i18n_1.default.__('fileIsNotExist'), COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
                (0, printText_1.default)(e);
            }
            return null;
        }
    }
}
exports.default = Writer;
