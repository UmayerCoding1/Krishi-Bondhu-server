"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    statusCode;
    message;
    data;
    success;
    constructor(statusCode, message = "Success", data, success) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = success;
    }
}
exports.ApiResponse = ApiResponse;
