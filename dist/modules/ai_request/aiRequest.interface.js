"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiRequestStatus = exports.RequestCategory = void 0;
var RequestCategory;
(function (RequestCategory) {
    RequestCategory["DISEASE_DETECTION"] = "disease_detection";
    RequestCategory["CROP_ADVICE"] = "crop_advice";
    RequestCategory["CHAT_WITH_AI"] = "chat_with_ai";
    RequestCategory["OTHER"] = "other";
})(RequestCategory || (exports.RequestCategory = RequestCategory = {}));
var AiRequestStatus;
(function (AiRequestStatus) {
    AiRequestStatus["SUCCESS"] = "success";
    AiRequestStatus["FAILED"] = "failed";
})(AiRequestStatus || (exports.AiRequestStatus = AiRequestStatus = {}));
