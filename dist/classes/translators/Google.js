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
const intrapolation_1 = require("../../utils/intrapolation");
// @ts-ignore
const object_path_set_1 = __importDefault(require("object-path-set"));
class Google extends Translator_1.default {
    constructor(langFrom, langTo, targetJson) {
        var _a, _b;
        super(langFrom, langTo, targetJson);
        this.name = 'Google';
        this.axios = axios_1.default.create({
            baseURL: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Accept-Encoding': 'application/gzip',
                'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
                'X-RapidAPI-Key': ((_b = (_a = this.configFile) === null || _a === void 0 ? void 0 : _a.translatorKeys) === null || _b === void 0 ? void 0 : _b.google) || 'fd3f1a1c35mshe2ea65941658536p1f6146jsn0b4018414817'
            }
        });
    }
    translate() {
        return __awaiter(this, void 0, void 0, function* () {
            const translateObject = this._dataGenerator();
            const response = yield this.axios.post('', translateObject.encodedParams);
            const requestMicrosoft = translateObject.microsoftStyle.map((item, key) => ({
                key: item.key,
                text: response.data.data.translations[key].translatedText
            }));
            // Если интерполяция будет переведена переводчиком
            requestMicrosoft.forEach((item, key) => {
                requestMicrosoft[key].text = (0, intrapolation_1.replaceInterpolation)(translateObject.microsoftStyle[key].text, item.text);
            });
            return this._toJson(translateObject.microsoftStyle, requestMicrosoft);
        });
    }
    _dataGenerator() {
        const encodedParams = new URLSearchParams();
        encodedParams.append("source", this.langFrom);
        encodedParams.append("target", this.langTo);
        const microsoftStyle = [];
        const generator = (obj, key) => {
            for (let item in obj) {
                if (typeof obj[item] === 'object') {
                    generator(obj[item], item);
                }
                else {
                    // Добавить к запросу.
                    encodedParams.append("q", obj[item]);
                    microsoftStyle.push({ text: obj[item], key: key ? `${key}.${item}` : item });
                }
            }
        };
        generator(this.targetJson, '');
        return {
            encodedParams,
            microsoftStyle
        };
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
exports.default = Google;
