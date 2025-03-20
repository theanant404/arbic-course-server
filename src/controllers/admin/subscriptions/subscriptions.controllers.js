import { asyncHandler } from "../../../utils/asyncHandler.js";
import { ApiResponse } from "../../../utils/ApiResponse.js";
import { Subscription } from "../../../models/admin/subscriptions.models.js";
const createSubscription = asyncHandler(async (req, res) => {
    const {plan,price,discription,title} = req.body;
    console.log(req.body);
    if (!plan || !discription|| !title) {
        return res.status(400).json(new ApiResponse(400, "All fields are required"));
    }
    const existingSubscription = await Subscription.findOne
        ({ plan });
    if (existingSubscription) {
        return res.status(400).json(new ApiResponse(400, "Subscription already exists"));
    }
    const subscription = await Subscription.create({
        title,
        plan,
        price,
        discription
    });
    if (!subscription) {
        return res.status(400).json(new ApiResponse(400, "Something went wrong"));
    }
    return res.status(201).json(
        new ApiResponse(201, "Subscription created successfully", {
            subscription,
        })
    );
});
const getAllSubscriptions = asyncHandler(async (req, res) => {
    const subscriptions = await Subscription.find();
    if (!subscriptions) {
        return res.status(400).json(new ApiResponse(400, "Something went wrong"));
    }
    return res.status(200).json(
        new ApiResponse(200, "Subscriptions fetched successfully", {
            subscriptions,
        })
    );
});
export { createSubscription, getAllSubscriptions };