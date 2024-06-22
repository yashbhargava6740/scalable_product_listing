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

export const removeProduct = async(req:Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide all fields" });
    }
    const dbProduct = await prismaClient.product.delete({
      where: {
        id : parseInt(id),
      },
    });
    if (dbProduct) {
      return res.status(204).json(dbProduct);
    } else {
      return res.status(400).json({ message: "Product not removed" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
}