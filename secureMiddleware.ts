//gt contro of gb is ingelogd.
//ingelogd? gb w aan res.locals toegevgd zdt deze beschkbr is in de views.
//nt? gb drgstrd nr login
import { NextFunction, Request, Response } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
  // if (!req.session.user && req.path !== '/login' && req.path !== '/register') {
  //   res.redirect("/login");
  // } else {
  //   res.locals.user = req.session.user;
  //   next();
  // }
  if (req.session.user) {
    res.locals.user = req.session.user;
    next();
  } else {
    res.redirect("/login");
  }
};