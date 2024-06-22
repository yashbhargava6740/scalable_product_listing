import express from "express";
import asyncHandler from "express-async-handler";
import JWTService from "../services/jwt";
import { prismaClient } from "../clients/db/PrismaClient";

require("dotenv").config();
export const protect: express.RequestHandler = asyncHandler(
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let token;

    if (req.cookies.jwt) {
      try {
        token = req.cookies.jwt;
        const decoded = JWTService.decodeToken(token);
        req.body.role = decoded.role;
        next();
      } catch {
        res.status(500);
        throw new Error("Not authorized, token failed");
      }
    }

    if (!token) {
      res.status(500);
      throw new Error("Not authorized, no token");
    }
  }
);
