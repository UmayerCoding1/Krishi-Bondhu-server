"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHashPassword = createHashPassword;
exports.verifyHashPassword = verifyHashPassword;
const crypto_1 = __importDefault(require("crypto"));
function createHashPassword(password) {
    const slug = crypto_1.default.randomBytes(16).toString('hex');
    const hash = crypto_1.default.pbkdf2Sync(password, slug, 100000, 64, 'sha256');
    return { slug, hash: hash.toString('hex') };
}
;
function verifyHashPassword(password, slug, hash) {
    const hashVerify = crypto_1.default.pbkdf2Sync(password, slug, 100000, 64, 'sha256');
    return hashVerify.toString('hex') === hash;
}
;
