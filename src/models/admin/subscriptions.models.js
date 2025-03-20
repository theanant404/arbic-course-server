import mongoose, { Schema } from "mongoose";
import { User } from "../auth/user.models.js";
import { SubscriptionPlanEnum } from "../../constants.js";

const subscriptionSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    title: {
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
    discription: {
        type: String,
        required: true,
    },
},{timestamps:true});
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
