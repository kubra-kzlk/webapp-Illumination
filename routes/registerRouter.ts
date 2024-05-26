import express from "express";
import { register } from '../database';
import { checkLogin } from "../secureMiddleware";

export function registerRouter() {
  const router = express.Router();

  router.get('/register',checkLogin, async (req, res) => {
    res.render('register');
  });

  router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      await register(email, password)
      res.redirect("/login");
    } catch (err: any) {
      res.render("register", { error: err.message })
    }
  });
  return router;
}