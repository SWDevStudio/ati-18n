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
const Translator_1 = __importDefault(require("./Translator"));
const axios_1 = __importDefault(require("axios"));
// @ts-ignore
const object_path_set_1 = __importDefault(require("object-path-set"));
const intrapolation_1 = require("../../utils/intrapolation");
class Microsoft extends Translator_1.default {
    constructor(langFrom, langTo, targetJson) {
        var _a, _b;
        super(langFrom, langTo, targetJson);
        this.name = 'Microsoft';
        this.axios = axios_1.default.create({
            baseURL: 'https://microsoft-translator-text.p.rapidapi.com',
            headers: {
                'content-type': 'application/json',
                'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
                'x-rapidapi-key': ((_b = (_a = this.configFile) === null || _a === void 0 ? void 0 : _a.translatorKeys) === null || _b === void 0 ? void 0 : _b.microsoft) || 'fd3f1a1c35mshe2ea65941658536p1f6146jsn0b4018414817'
            },
            params: {
                'api-version': '3.0',
                from: langFrom,
                to: langTo,
                textType: 'plain',
                profanityAction: 'NoAction'
            }
        });
    }
    translate() {
        return __awaiter(this, void 0, void 0, function* () {
            // У нас есть Json объект в котором есть объект с любой вложенностью.
            // Нужно сгенерировать data объект для API
            // После чего нужно получить ответ и собрать объект заново.
            // Далее возвращаем объект в едином виде для всего.
            const translateObject = this._dataGenerator();
            // Возможно у некоторых API есть сразу перевод объект, что позволит не писать прослойку => нужно проверить есть ли такое в Microsoft
            const response = yield this.axios.post('/translate', translateObject);
            const translateResponse = response.data.map(i => i.translations).flat();
            // Если интерполяция будет переведена переводчиком
            translateResponse.forEach((item, key) => {
                translateResponse[key].text = (0, intrapolation_1.replaceInterpolation)(translateObject[key].text, item.text);
            });
            return this._toJson(translateObject, translateResponse);
        });
    }
    _dataGenerator() {
        const arr = [];
        const generator = (obj, key) => {
            for (let item in obj) {
                if (typeof obj[item] === 'object') {
                    generator(obj[item], item);
                }
                else {
                    arr.push({ text: obj[item], key: key ? `${key}.${item}` : item });
                }
            }
        };
        generator(this.targetJson, '');
        return arr;
    }
    _toJson(generatedData, response) {
        const setKeyForResponse = response.map((i, k) => {
            return {
                text: i.text,
                key: generatedData[k].key
            };
        });
        const obj = {};
        setKeyForResponse.forEach((i) => {
            (0, object_path_set_1.default)(obj, i.key, i.text);
        });
        return obj;
    }
}
exports.default = Microsoft;
