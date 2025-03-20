// create a subscription model
import mongoose from "mongoose";
import { SubscriptionPlanEnum } from "../../constants.js";
const subscriptionDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    email:{
        type: String,
        required: true,
    },
    plan: {
        type: String,
        enum: Object.values(SubscriptionPlanEnum),
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
},{timestamps:true});
export const SubscriptionData = mongoose.model("SubscriptionData", subscriptionDataSchema);
