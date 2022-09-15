import { NextFunction, Request, Response } from "express";
import { promisify } from "util";
import { client } from "../redis";
import jwt, { JwtPayload } from "jsonwebtoken";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import HttpStatusCode from "../utils/constants/httpStatusCodes";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt/tokens";
import prisma from "../utils/prisma";

export const refreshToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("hit!");
    // get Cookies
    const cookies = req.cookies;
    console.log(cookies);
    console.log("jwt: ", cookies?.jwt);
    // check if the refresh token exists
    if (!cookies?.jwt) {
      return next(
        new AppError("you trying to hack?", HttpStatusCode.UNAUTHORIZED)
      );
    }
    // get the refresh Token and decode it
    const refreshToken = cookies?.jwt;
    const decoded: JwtPayload = await promisify(jwt.verify)(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // check if the refresh token exists in redis
    if (await prisma.user.findUnique({ where: { id: decoded.id } })) {
      if (await client.EXISTS(decoded.id)) {
        // check if the refresh token is equal to the refresh token in redis
        if ((await client.get(decoded.id)) === refreshToken) {
          //genereate new refresh token
          const newRefreshToken = generateRefreshToken(decoded.id);

          // replace the existing refresh token in redis with the new one
          await client.setEx(decoded.id, 259200, newRefreshToken);

          // send the new refresh Token in a cookie
          res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            sameSite: "none",
            secure: false,
            expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          });
          // send the new refresh Token in response
          const newAccessToken = generateAccessToken(decoded.id);
          res.status(HttpStatusCode.OK).json({
            accessToken: newAccessToken,
          });
        }
      }
    }
    return next(new AppError("Unotharized", HttpStatusCode.UNAUTHORIZED));
  }
);
