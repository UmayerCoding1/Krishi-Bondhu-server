import mongoose, { Schema, model, models } from "mongoose";
import { IUSer, PLANTYPE, ROLE, STATUS } from "./user.interface";
import { createHashPassword } from "../../utils/crypto-hash";

const userSchema = new Schema<IUSer>({
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
        enum: ROLE,
        default: ROLE.USER
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
    isTwoFactorEnabled: {
        type: Boolean,
        default: false
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
        enum: STATUS,
        default: STATUS.ACTIVE
    },
    system_config: {
        notification: {
            email: {
                type: Boolean,
                default: false
            },
            system_notification: {
                type: Boolean,
                default: false
            },
            safety_alert: {
                type: Boolean,
                default: false
            }
        }
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
        const { slug, hash } = createHashPassword(this.password);
        this.password = hash;
        this.slug = slug;
    }
});

export const User = models.User || model<IUSer>("User", userSchema);
