import { NextFunction, Request, Response } from "express";
//kijken of er n msg in de sessie zit. Als deze er is voegen 
//we deze toe aan de res.locals en verwijderen we deze uit de sessie. 
export function flashMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // if (req.session.message) {
  //   res.locals.message = req.session.message;
  //   delete req.session.message;
  // } else {
  //   res.locals.message = undefined;
  // }
  next();
}
