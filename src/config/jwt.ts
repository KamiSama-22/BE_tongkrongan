// src/config/jwt.ts
import jwt from "jsonwebtoken";
import 'dotenv/config';

const JWT_SECRET = "rahasia123";

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};