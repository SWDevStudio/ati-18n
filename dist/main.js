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
const printText_1 = __importDefault(require("./utils/printText"));
const DEFAULT_CONFIG_1 = require("./const/DEFAULT_CONFIG");
const inquirer_1 = require("inquirer");
const Google_1 = __importDefault(require("./classes/translators/Google"));
const mergeObjects_1 = require("./utils/mergeObjects");
const i18n_1 = __importDefault(require("./classes/i18n"));
const commander = commander_1.program;
commander
    .version('1.3.0')
    .description(i18n_1.default.__('descriptionCLI'));
commander
    .command('translate')
    .description(i18n_1.default.__('descriptionCLI'))
    .option('--from <value>', i18n_1.default.__('fromLanguage'))
    .option('--to <value>', i18n_1.default.__('toLanguage'))
    .option('-r, --read <value>', i18n_1.default.__('read'))
    .option('-w, --patch-write <value>', i18n_1.default.__('write'))
    .option('--filename <value>', i18n_1.default.__('filename'))
    .action((args) => __awaiter(void 0, void 0, void 0, function* () {
    const configFile = new Writer_1.default().readFile('./ati-18n.config.json', true);
    let ctx = args;
    if (configFile) {
        ctx = Object.assign(Object.assign({}, configFile), ctx);
    }
    const startTranslate = (lang) => __awaiter(void 0, void 0, void 0, function* () {
        if (!ctx.read) {
            if (!ctx.from) {
                (0, printText_1.default)(i18n_1.default.__('errorReadFile'));
                return;
            }
            else {
                (0, printText_1.default)(i18n_1.default.__('findReadFile', { from: ctx.from }));
                return;
            }
        }
        if (!ctx.patchWrite)
            (0, printText_1.default)(i18n_1.default.__('errorFolder'));
        const writer = new Writer_1.default({
            pathRead: ctx.read || `./locales/${ctx.from}.json`,
            pathWrite: ctx.patchWrite || './locales'
        });
        const realFile = writer.readFile();
        if (realFile) {
            const translators = [
                new Microsoft_1.default(ctx.from, lang, realFile),
                new Google_1.default(ctx.from, lang, realFile)
            ];
            const result = [];
            for (let translator of translators) {
                try {
                    result.push(yield translator.translate());
                }
                catch (e) {
                    if (ctx.printTranslateError) {
                        (0, printText_1.default)(i18n_1.default.__('whatError', { name: translator.name, lang }), COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
                        const { response } = yield (0, inquirer_1.prompt)({
                            type: 'list', name: 'response', message: i18n_1.default.__('findDetails'), choices: ['yes', 'no']
                        });
                        if (response === 'yes') {
                            console.log(e);
                        }
                    }
                    //TODO добавить возможность записывать логи программы в отдельный файл, что бы их можно было посмотреть.
                }
            }
            try {
                yield writer.writeFile(lang, result.length >= 2 ? yield (0, mergeObjects_1.mergeObjects)(result, realFile) : result[0]);
                (0, printText_1.default)(i18n_1.default.__('successWrite'), COLOR_CONSOLE_1.COLOR_CONSOLE.FgGreen);
            }
            catch (e) {
                (0, printText_1.default)(e, COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
            }
        }
    });
    if (Array.isArray(ctx.to)) {
        for (let i of ctx.to) {
            yield startTranslate(i);
        }
    }
    else {
        yield startTranslate(ctx.to);
    }
}));
commander
    .command('generate-config')
    .description(i18n_1.default.__('generateConfigDescription'))
    .action(() => __awaiter(void 0, void 0, void 0, function* () {
    const writer = new Writer_1.default({
        pathWrite: './',
    });
    try {
        yield writer.writeFile('ati-18n.config', DEFAULT_CONFIG_1.DEFAULT_CONFIG);
        (0, printText_1.default)(i18n_1.default.__('createConfigFile'), COLOR_CONSOLE_1.COLOR_CONSOLE.FgGreen);
    }
    catch (e) {
        (0, printText_1.default)(i18n_1.default.__('failCreateConfigFile'), COLOR_CONSOLE_1.COLOR_CONSOLE.FgRed);
        (0, printText_1.default)(e);
    }
}));
// TODO  добавить метод который будет генерировать enum файл с ключами для перевода (возможно)
commander.parse(process.argv);
