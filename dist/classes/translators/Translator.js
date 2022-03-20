"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Translator {
    constructor(langFrom, langTo, target) {
        this.targetJson = target;
        this.langFrom = langFrom;
        this.langTo = langTo;
    }
}
exports.default = Translator;
