import { User } from "@prisma/client";

import jwt from "jsonwebtoken";
export const generateAccessToken = (user: User) => {
  const accessToken = jwt.sign(
    { id: user.id },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
  return accessToken;
};
export const generateRefreshToken = (user: User): string => {
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
  return refreshToken;
};
