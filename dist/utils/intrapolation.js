"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceInterpolation = exports.searchInterpolation = void 0;
function searchInterpolation(str) {
    return Array.from(str.matchAll(/{{[\w\sа-я]+}}/g), m => m[0]);
}
exports.searchInterpolation = searchInterpolation;
function replaceInterpolation(string, translatedString) {
    const interpolation = searchInterpolation(string);
    const newInterpolation = searchInterpolation(translatedString);
    let str = translatedString;
    newInterpolation.forEach((i, k) => {
        str = str.replace(i, interpolation[k]);
    });
    return str;
}
exports.replaceInterpolation = replaceInterpolation;
