#!/usr/bin/env node
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
const commander_1 = require("commander");
const Writer_1 = __importDefault(require("./classes/Writer"));
const Microsoft_1 = __importDefault(require("./classes/translators/Microsoft"));
const COLOR_CONSOLE_1 = require("./const/COLOR_CONSOLE");
const commander = commander_1.program;
commander
    .version('1.0.0')
    .description('Котики захватят мир');
commander
    .command('translate <from> <to>')
    .description('Создает новый файл с текстами для перевода.')
    .option('--read <value>', 'На основании какого файла переводим')
    .option('--patch-write <value>', 'папка в которую записываем')
    .option('--filename <value>', 'имя файла при сохранении')
    .action((from, to, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (!options.read) {
        console.log(`Файл для чтения не указан, попытка найти ./locales/${from}.json`);
    }
    const writer = new Writer_1.default({
        pathRead: options.read || `./locales/${from}.json`,
        pathWrite: options.patchWrite || './locales'
    });
    const realFile = writer.readFile();
    if (realFile) {
        const translators = [
            new Microsoft_1.default(from, to, realFile)
        ];
        // TODO сделать перевод и сравнение результатов с нескольких переводчиков
        // TODO интерполяция не работает {{ name }} - на выходе получаем {{ имя }} ожидаем {{ name }}
        const result = yield Promise.all(translators.map(i => i.translate()));
        //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
        if (!options.patchWrite)
            console.log('Не указана папка в которую нужно записывать файл, по дефолту выбрана папка ./locales');
        try {
            writer.writeFile(options.filename || to, result[0]);
            console.log(COLOR_CONSOLE_1.COLOR_CONSOLE.FgGreen, 'Файл успешно записан');
        }
        catch (e) {
            console.log(COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed, e);
        }
    }
}));
commander.parse(process.argv);
