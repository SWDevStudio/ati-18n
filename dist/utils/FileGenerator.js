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
Object.defineProperty(exports, "__esModule", { value: true });
const inquirer_1 = require("inquirer");
/**
 * @deprecated
 */
function FileGenerator(object, translators) {
    return __awaiter(this, void 0, void 0, function* () {
        const file = {};
        const ignoredWord = '%';
        const startInterpolation = '{{';
        const endInterpolation = '}}';
        for (let item in object) {
            if (typeof object[item] === 'object') {
                file[item] = yield FileGenerator(object[item], translators);
            }
            else {
                let str = object[item];
                const translates = yield Promise.all(translators.map(i => i.translate({ str })));
                const coincidence = (arr) => [...new Set(translates.map(i => i.value))];
                const isNotCoincidence = coincidence(translates);
                // Проверить расхождение переводов если различаются,
                if (isNotCoincidence.length > 1) {
                    const customTranslate = 'Свой вариант';
                    const response = yield (0, inquirer_1.prompt)({
                        type: 'list',
                        message: 'Конфликт переводов, выберете подходящий для вас',
                        name: 'selected',
                        choices: [...translates.map(i => `${i.translator}: ${i.value}`), customTranslate],
                    });
                    if (response.selected === customTranslate) {
                        const response = yield (0, inquirer_1.prompt)({
                            type: 'input',
                            message: 'Введите свой вариант:',
                            name: 'input'
                        });
                        str = response.input;
                    }
                    else {
                        str = response.selected;
                    }
                    // проработать если не один вариант не нравится.
                }
                file[item] = str;
            }
        }
        return file;
    });
}
exports.default = FileGenerator;
