import { prismaClient } from "../clients/db/PrismaClient";
import { Request, Response } from "express";
export const addProduct = async (req: Request, res: Response) => {
  const { name, price, description, owner, color } = req.body;
  try {
    if (!name || !price || !description || !owner) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    if (!req.body.id) {
      res.status(401).json({ message: "Not authenticated" });
    }

    const dbProduct = await prismaClient.product.create({
      data: {
        title: name,
        price,
        description,
        owner: { connect: { id: req.body.id } },
        color,
      },
    });
    if (dbProduct) {
      return res.status(201).json(dbProduct);
    } else {
      return res.status(400).json({ message: "Product not added" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
