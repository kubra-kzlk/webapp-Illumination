//gt contro of gb is ingelogd.
//ingelogd? gb w aan res.locals toegevgd zdt deze beschkbr is in de views.
//nt? gb drgstrd nr login
import { NextFunction, Request, Response } from "express";

export function secureMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    res.locals.user = req.session.user;
    next(); //Anders zal de request niet naar de volgende middleware functie in de stack gaan en zal deze request ook niet naar de route gaan.
  } else {
    res.redirect("/login");
  }//als gb ingelogd: gb toegevoegd aan de res.locals zodat deze beschikbr is in de views. 
  //Als gb nt ingelogd;gb drgestrd nr loginpag
};

export function checkLogin(req: Request, res: Response, next: NextFunction) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}