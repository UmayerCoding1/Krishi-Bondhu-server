"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS = exports.ROLE = exports.PLANTYPE = void 0;
var PLANTYPE;
(function (PLANTYPE) {
    PLANTYPE["FREE"] = "free";
    PLANTYPE["PREMIUM"] = "premium";
})(PLANTYPE || (exports.PLANTYPE = PLANTYPE = {}));
var ROLE;
(function (ROLE) {
    ROLE["USER"] = "user";
    ROLE["ADMIN"] = "admin";
})(ROLE || (exports.ROLE = ROLE = {}));
var STATUS;
(function (STATUS) {
    STATUS["ACTIVE"] = "active";
    STATUS["INACTIVE"] = "inactive";
    STATUS["BANNED"] = "banned";
    STATUS["BLOCK"] = "block";
    STATUS["DELETED"] = "deleted";
})(STATUS || (exports.STATUS = STATUS = {}));
