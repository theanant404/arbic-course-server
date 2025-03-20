import mongoose,{Schema} from "mongoose";
import {AvailableCouponTypes,CouponTypeEnum} from "../../constants.js";
const couponSchema = new Schema({
    couponCode:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    couponType:{
        type: String,
        enum: AvailableCouponTypes,
        default: CouponTypeEnum.FLAT,
        required: true,
    },
    discount:{
        type: Number,
        required: true,
        trim: true,
    },
    minOrderAmount:{
        type: Number,
        required: true,
        trim: true,
    },
    maxDiscountAmount:{
        type: Number,
        required: true,
        trim: true,
    },
    isDeleted:{
        type: Boolean,
        default: false,
    },
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
},{
    timestamps: true
});
const Coupon = mongoose.model("Coupon",couponSchema);
export {Coupon};
