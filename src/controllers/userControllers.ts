import { Request, Response } from "express";
import { prismaClient } from "../clients/db/PrismaClient";

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { pid } = req.params;
    const product = await prismaClient.product.findUnique({
      where: {
        id: parseInt(pid),
      },
    });
    if (!product) {
      res.status(400).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prismaClient.product.findMany();
    if (!products) {
      res.status(400).json({ message: "Products not found" });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
