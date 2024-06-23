import { prismaClient } from "../clients/db/PrismaClient";
import { Request, Response } from "express";

export const addProduct = async (req: Request, res: Response) => {
  if(req.body.role !== "admin") {
    res.status(401).json({message: "Not authorized"});
  }
  const { name, price, description, owner, color } = req.body;
  try {
    if (!name || !price || !description || !owner) {
      res.status(400).json({ message: "Please provide all fields" });
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
      res.status(201).json(dbProduct);
    } else {
      res.status(400).json({ message: "Product not added" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const removeProduct = async(req:Request, res: Response) => {
  if(req.body.role !== "admin") {
    return res.status(401).json({message: "Not authorized"});
  }
  try {
    const { pid } = req.params;
    if (!pid) {
      res.status(400).json({ message: "Please provide all fields" });
    }
    const dbProduct = await prismaClient.product.delete({
      where: {
        id : parseInt(pid),
      },
    });
    if (dbProduct) {
      res.status(204).json(dbProduct);
    } else {
      res.status(400).json({ message: "Product not removed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
}

export const updateProduct = async(req:Request, res: Response) => {
  if(req.body.role !== "admin") {
    res.status(401).json({message: "Not authorized"});
  }
  try {
    const { pid, name, price, description, color } = req.body;
    console.log(req.body);
    const dbProduct = await prismaClient.product.update({
      where: {
        id: parseInt(pid)
      }, 
      data: {
        title: name,
        price: parseFloat(price),
        description,
        color,
      }
    });
    if(!dbProduct) {
      res.status(400).json({message: "Product not updated"});
    }
    res.status(200).json(dbProduct);
  } catch(error) {
    res.status(500).json({message:error});
  } 
}

export const getProducts = async(req:Request, res: Response) => {
  if(req.body.role !== "admin") {
    res.status(401).json({message: "Not authorized"});
  }
  try {
    const products = await prismaClient.product.findMany();
    if(!products) {
      res.status(400).json({message: "Products not found"});
    }
    res.status(200).json(products);
  } catch(error) {
    res.status(500).json({message:error});
  } 
}

export const getProduct = async(req:Request, res: Response) => {
  if(req.body.role !== "admin") {
    res.status(401).json({message: "Not authorized"});
  }
  try {
    const { pid } = req.params;
    const product = await prismaClient.product.findUnique({
      where: {
        id: parseInt(pid)
      }
    });
    if(!product) {
      res.status(400).json({message: "Product not found"});
    }
    res.status(200).json(product);
  } catch(error) {
    res.status(500).json({message:error});
  }
}