import { prismaClient } from "../clients/db/PrismaClient";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserOrAdmin } from "../types";
import JWTService from "../services/jwt";
require("dotenv").config();
export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  // Input validation
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password and role are required" });
  }

  try {
    let validUser: UserOrAdmin | null = null;
    if (role === "user") {
      validUser = (await prismaClient.user.findUnique({
        where: {
          email: email,
        },
      })) as UserOrAdmin | null;
    } else {
      validUser = await prismaClient.admin.findUnique({
        where: {
          email: email,
        },
      });
    }
    if (validUser === null) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = JWTService.generateWebToken(validUser, role);
    
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
    });
    const {id, name: dbName, email: dbEmail} = validUser;
    res.status(200).json({id, name:dbName, email:dbEmail });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const register = async (req:Request, res:Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Input validation
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Name, email, role and password are required" });
    }
    
    let existingUser : UserOrAdmin | null = null;
    if(role === "user") {
        existingUser = await prismaClient.user.findUnique({
            where: {
                email: email
            }
        });
    } else {
        existingUser = await prismaClient.admin.findUnique({
            where: {
                email: email
            }
        });
    }
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    let dbUser: UserOrAdmin | null = null;
    if(role === "user") {
        dbUser = await prismaClient.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
    } else {
        dbUser = await prismaClient.admin.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });
    }    
    const {id, name: dbName, email: dbEmail} = dbUser;
    res.status(201).json({ message: "User registered successfully", data : {id, name:dbName, email:dbEmail}});
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
