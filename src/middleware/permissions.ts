import { NextFunction, Request, Response } from "express";
import jsonwebtoken from 'jsonwebtoken';

export function hasRigths(req: Request, res: Response, next: NextFunction) {
  const tokenData: any = jsonwebtoken.decode(req.cookies.access_token);

  if (req.params.id === tokenData?._id || tokenData?.admin === 1) {
    next();
  } else {
    res.status(401).json({
      message: "Vous n'avez pas les droits pour effectuer cette action",
    });
  }
}
