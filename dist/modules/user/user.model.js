"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const user_interface_1 = require("./user.interface");
const crypto_hash_1 = require("../../utils/crypto-hash");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true
    },
    avatar: {
        type: String,
    },
    role: {
        type: String,
        enum: user_interface_1.ROLE,
        default: user_interface_1.ROLE.USER
    },
    otp: {
        code: {
            type: String,
            max: 4,
            min: 4
        },
        expiresAt: {
            type: Date,
        },
        slug: {
            type: String,
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    fermaerId: {
        type: String,
        unique: true,
        index: true
    },
    accessToken: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    status: {
        type: String,
        enum: user_interface_1.STATUS,
        default: user_interface_1.STATUS.ACTIVE
    },
    // plan: {
    //     type: {
    //         type: String,
    //         enum: PLANTYPE,
    //         default: PLANTYPE.FREE
    //     },
    //     startDate: {
    //         type: Date,
    //     },
    //     endDate: {
    //         type: Date,
    //     },
    //     token: {
    //         type: Number,
    //         default: 0
    //     },
    //     planId: {
    //         type: Schema.Types.ObjectId,
    //         ref: "Plan"
    //     }
    // }
}, { timestamps: true });
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const { slug, hash } = (0, crypto_hash_1.createHashPassword)(this.password);
        this.password = hash;
        this.slug = slug;
    }
});
exports.User = mongoose_1.models.User || (0, mongoose_1.model)("User", userSchema);
