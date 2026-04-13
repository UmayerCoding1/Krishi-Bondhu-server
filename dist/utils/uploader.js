"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Uploader = void 0;
const multer_1 = __importDefault(require("multer"));
class Uploader {
    static single(fieldName) {
        return (0, multer_1.default)().single(fieldName);
    }
    static multiple(fieldName, count) {
        return (0, multer_1.default)().array(fieldName, count);
    }
}
exports.Uploader = Uploader;
