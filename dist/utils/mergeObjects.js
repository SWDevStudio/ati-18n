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
exports.mergeObjects = void 0;
const inquirer_1 = require("inquirer");
const i18n_1 = __importDefault(require("../classes/i18n"));
function mergeObjects(jsons, realFile) {
    return __awaiter(this, void 0, void 0, function* () {
        const newJson = JSON.parse(JSON.stringify(jsons[0]));
        const deepCompression = (Json, nesting, realFile) => __awaiter(this, void 0, void 0, function* () {
            for (let item in Json) {
                if (typeof Json[item] === 'object') {
                    yield deepCompression(Json[item], nesting.map((i) => i[item]), realFile[item]);
                }
                else {
                    const translateCollections = Array.from(new Set([Json[item], ...nesting.map(i => i[item])]));
                    if (translateCollections.length >= 2) {
                        const { response } = yield (0, inquirer_1.prompt)({
                            type: 'list',
                            name: 'response',
                            message: i18n_1.default.__('failMergeObject', { text: realFile[item] }),
                            choices: [
                                ...translateCollections.map(item => ({
                                    name: `${item}`,
                                    value: item
                                })),
                                {
                                    name: i18n_1.default.__('yourChoice'),
                                    value: 'custom'
                                }
                            ],
                        });
                        if (response === 'custom') {
                            const { customVariant } = yield (0, inquirer_1.prompt)({
                                type: 'input',
                                message: i18n_1.default.__('writeYourChoice'),
                                name: 'customVariant'
                            });
                            Json[item] = customVariant;
                        }
                        else {
                            Json[item] = response;
                        }
                    }
                }
            }
        });
        yield deepCompression(newJson, jsons, realFile);
        // console.log(newJson)
        return newJson;
    });
}
exports.mergeObjects = mergeObjects;
