import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import { client } from "../redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import { generateRefreshToken } from "../utils/jwt/tokens";

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if cookies exists
    const cookies = req.cookies;
    console.log(req.cookies);

    if (!cookies) {
      return next(new AppError("unknown user", HttpStatusCode.FORBIDDEN));
    }

    // get the refresh Token and decode it
    const refreshToken = cookies?.jwt;
    if (!refreshToken) {
      return next(
        new AppError("you trying to hack?", HttpStatusCode.UNAUTHORIZED)
      );
    }
    const decoded: JwtPayload = await promisify(jwt.verify)(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // // check if the refresh token exists in redis
    if (await client.EXISTS(decoded.id)) {
      //   // check if the refresh token is equal to the refresh token in redis
      if ((await client.get(decoded.id)) === refreshToken) {
        //     // genereate new refresh token
        const newRefreshToken = generateRefreshToken(req.user!);

        //     // replace the existing refresh token in redis with the new one
        await client.setEx(decoded.id, 259200, newRefreshToken);

        //     // send the new refresh Token in a cookie
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "none",
          expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        });
        // send the new refresh Token in response
        res.status(HttpStatusCode.OK).json({
          refreshToken: newRefreshToken,
        });
      }
    }
  }
);
