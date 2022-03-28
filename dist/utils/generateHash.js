"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateHash(size) {
    const length = size || Math.random() * 11;
    const chrs = 'abdehkmnpswxz123456789';
    let str = '';
    for (let i = 0; i < length; i++) {
        const pos = Math.floor(Math.random() * chrs.length);
        str += chrs.substring(pos, pos + 1);
    }
    return str;
}
exports.default = generateHash;
