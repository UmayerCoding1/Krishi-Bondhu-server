"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileValidator = void 0;
class fileValidator {
    allowedTypes;
    maxSize;
    constructor(allowedTypes, maxSize) {
        this.allowedTypes = allowedTypes;
        this.maxSize = maxSize;
    }
    validate(file) {
        if (!file) {
            throw new Error("File is required");
        }
        if (!this.allowedTypes.includes(file.mimetype)) {
            throw new Error("Invalid file type");
        }
        if (file.size > this.maxSize) {
            throw new Error("File too large");
        }
        return true;
    }
}
exports.fileValidator = fileValidator;
