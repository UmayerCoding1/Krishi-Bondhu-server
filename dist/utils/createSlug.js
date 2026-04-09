"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slugify_1 = __importDefault(require("slugify"));
const cretateSlug = async (text) => {
    return slugify_1.default(text, { lower: true, strict: true });
};
exports.default = cretateSlug;
