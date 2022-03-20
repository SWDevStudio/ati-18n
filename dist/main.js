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
const printColorText_1 = __importDefault(require("./utils/printColorText"));
const DEFAULT_CONFIG_1 = require("./const/DEFAULT_CONFIG");
const commander = commander_1.program;
commander
    .version('1.0.1')
    .description('Скриптовый перевод JSON файлов, при помощи API переводчиков.');
commander
    .command('translate')
    .description('Создает новый файл с текстами для перевода.')
    .option('--from <value>', 'С какого языка переводится')
    .option('--to <value>', 'На какой язык нужен перевод')
    .option('-r, --read <value>', 'Путь к файлу который нужно перевести. Пример => ./locales/en.json')
    .option('-w, --patch-write <value>', 'Путь к папке, в которую будет записан файл. Пример => ./locales')
    .option('--filename <value>', 'Имя файла при сохранении. По умолчанию выбранный язык.')
    .action((args) => __awaiter(void 0, void 0, void 0, function* () {
    const configFile = new Writer_1.default({
        pathRead: './ati-18n.config.json'
    });
    const ctx = Object.assign(Object.assign({}, configFile.readFile()), args);
    if (!ctx.read) {
        if (!ctx.from) {
            console.log('Укажите файл для чтения! Пример => --read ./locales/*.json');
            return;
        }
        else {
            console.log(`Файл для чтения не указан, попытка найти ./locales/${ctx.from}.json`);
        }
    }
    //TODO сделать мягкую перезапись если файл существует или же записывать рядом.
    if (!ctx.patchWrite)
        console.log('Не указана папка в которую нужно записывать файл, по дефолту выбрана папка ./locales');
    const writer = new Writer_1.default({
        pathRead: ctx.read || `./locales/${ctx.from}.json`,
        pathWrite: ctx.patchWrite || './locales'
    });
    const realFile = writer.readFile();
    if (realFile) {
        const translators = [
            new Microsoft_1.default(ctx.from, ctx.to, realFile)
        ];
        // TODO сделать перевод и сравнение результатов с нескольких переводчиков
        const result = yield Promise.all(translators.map(i => i.translate()));
        try {
            writer.writeFile(ctx.filename || ctx.to, result[0]);
            (0, printColorText_1.default)('Файл успешно записан', COLOR_CONSOLE_1.COLOR_CONSOLE.FgGreen);
        }
        catch (e) {
            (0, printColorText_1.default)(e, COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
        }
    }
}));
commander
    .command('generate-config')
    .description('Создает дефолтный конфигурационный файл для программы')
    .action(() => {
    const writer = new Writer_1.default({
        pathWrite: './',
    });
    try {
        writer.writeFile('ati-18n.config', DEFAULT_CONFIG_1.DEFAULT_CONFIG);
        (0, printColorText_1.default)('Создан базовый конфигурационный файл', COLOR_CONSOLE_1.COLOR_CONSOLE.FgGreen);
    }
    catch (e) {
        (0, printColorText_1.default)('Не удалось, создать конфигурационный файл', COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
        console.error(e);
    }
});
commander.parse(process.argv);
