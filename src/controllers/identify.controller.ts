import { Request, Response } from "express";

export const identifyCustomer = async (req: Request, res: Response) => {
  try {
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};
