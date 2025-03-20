

import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from "../../models/auth/user.models.js";
import { UserRolesEnum } from "../../constants.js";
import dotenv from "dotenv";
dotenv.config();

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // attach refresh token to the user document to avoid refreshing the access token with multiple refresh tokens
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating the access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    countryCode,
    whatsappNumber,
    plan,
    paymentsuccessFull,
    isEmailVerified,
    paymentResponse,
  } = req.body;
  if (
    !email ||
    !whatsappNumber ||
    !countryCode ||
    !password ||
    !plan ||
    !paymentsuccessFull
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // if(!isEmailVerified) {
  //     throw new ApiError(400, "Email is not verified");
  // }
  const existingUser = await User.findOne({ email });
//   console.log(existingUser);
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }
  const user = await User.create({
    name,
    email,
    password,
    countryCode,
    whatsappNumber,
    plan,
    paymentsuccessFull,
    isEmailVerified,
    role: UserRolesEnum.USER,
    paymentResponse,
  });
  await user.save();
  const createdUser = await User.findById(user._id).select(
    "-password -__v -role -createdAt -updatedAt -pymentResponse -paymentsuccessFull"
  );
  if (!createdUser) {
    throw new ApiError(400, "Something went wrong While creating user");
  }
//   console.log(createdUser);
  return res.status(201).json(
    new ApiResponse(201, "User created successfully", {
      user: createdUser,
    })
  );
});
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email }).select("+password"); // retrieve the password field
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // get the user document ignoring the password and refreshToken field
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // TODO: Add more options to make cookie more secure and reliable
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) // set the access token in the cookie
    .cookie("refreshToken", refreshToken, options) // set the refresh token in the cookie
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken }, // send access and refresh token in response if client decides to save them by themselves
        "User logged in successfully"
      )
    );
});
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
  
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
  
    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(401, "Invalid refresh token");
      }
  
      // check if incoming refresh token is same as the refresh token attached in the user document
      // This shows that the refresh token is used or not
      // Once it is used, we are replacing it with new refresh token below
      if (incomingRefreshToken !== user?.refreshToken) {
        // If token is valid but is used already
        throw new ApiError(401, "Refresh token is expired or used");
      }
      const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      };
  
      const { accessToken, refreshToken: newRefreshToken } =
        await generateAccessAndRefreshTokens(user._id);
  
      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
          new ApiResponse(
            200,
            { accessToken, refreshToken: newRefreshToken },
            "Access token refreshed"
          )
        );
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  });
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      { new: true }
    );
  
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };
  
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out"));
  });
export { registerUser, loginUser,logoutUser, refreshAccessToken };
