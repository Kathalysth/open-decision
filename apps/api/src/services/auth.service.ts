import httpStatus from "http-status";
import { tokenService, userService } from ".";
import ApiError from "../utils/ApiError";
import { TokenType } from "@open-decision/models/prisma-client";
import UserHandler from "../models/user.model";
import { tokenHandler } from "../models/token.model";
/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */

const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await UserHandler.isPasswordMatch(password, user))) {
    throw new ApiError({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Incorrect email or password",
    });
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken: string) => {
  const refreshTokenFromDb = await tokenHandler.findOne({
    token: refreshToken,
    type: TokenType.REFRESH,
    blacklisted: false,
  });

  if (!refreshTokenFromDb) {
    return;
  }

  await tokenHandler.deleteFromDbById(refreshTokenFromDb.id);
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken: string) => {
  try {
    return await tokenService.refreshTokens(refreshToken);
  } catch (error) {
    throw new ApiError({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Please authenticate",
    });
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (
  resetPasswordToken: string,
  newPassword: string
) => {
  try {
    const resetPasswordTokenFromDb = await tokenService.verifyToken(
      resetPasswordToken,
      TokenType.RESET_PASSWORD
    );
    const user = await userService.getUserByUuidOrId(
      resetPasswordTokenFromDb!.ownerUuid
    );
    if (!user) {
      throw new Error();
    }
    await userService.updateUserByUuidOrId(user.id, { password: newPassword });

    await tokenHandler.deleteAllTokenOfUser(
      resetPasswordTokenFromDb!.ownerUuid,
      TokenType.REFRESH
    );

    await tokenHandler.deleteAllTokenOfUser(
      resetPasswordTokenFromDb!.ownerUuid,
      TokenType.RESET_PASSWORD
    );

    //TODO: add acccessToken to blocklist
  } catch (error) {
    throw new ApiError({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Password reset failed",
    });
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken: string) => {
  try {
    const verifyEmailTokenFromDb = await tokenService.verifyToken(
      verifyEmailToken,
      TokenType.VERIFY_EMAIL
    );

    const user = await userService.getUserByUuidOrId(
      verifyEmailTokenFromDb!.ownerUuid
    );
    if (!user) {
      throw new Error();
    }
    await tokenHandler.deleteAllTokenOfUser(
      verifyEmailTokenFromDb!.ownerUuid,
      TokenType.VERIFY_EMAIL
    );

    await userService.updateUserByUuidOrId(user.id, { emailIsVerified: true });
  } catch (error) {
    throw new ApiError({
      statusCode: httpStatus.UNAUTHORIZED,
      message: "Email verification failed",
    });
  }
};

export const authService = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};
