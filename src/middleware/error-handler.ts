import {NextFunction, Request, Response} from "express";

export default function ErrorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log("================== CUSTOM ERROR HANDLER ===================");
  console.error(err);
  res.status(500).json({name: err.name, message: err.message});
  console.log("===========================================================");
}