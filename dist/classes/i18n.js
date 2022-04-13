"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const i18n_1 = require("i18n");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const configFile = fs_1.default.readFileSync('./ati-18n.config.json').toString();
const i18n = new i18n_1.I18n();
i18n.configure(({
    locales: ['ru', 'de', 'en'],
    defaultLocale: ((_a = JSON.parse(configFile)) === null || _a === void 0 ? void 0 : _a.programLanguage) || 'en',
    directory: path_1.default.join(__dirname, '../locales')
}));
exports.default = i18n;
