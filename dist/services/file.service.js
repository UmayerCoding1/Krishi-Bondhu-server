"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileService = void 0;
const fileValidator_1 = require("../utils/fileValidator");
class FileService {
    validator;
    constructor() {
        this.validator = new fileValidator_1.fileValidator(["image/jpeg", "image/png", "image/webp"], 5);
    }
    processUpload(file) {
        this.validator.validate(file);
        return {
            filename: file.filename,
            path: file.path,
            size: file.size,
        };
    }
}
exports.FileService = FileService;
