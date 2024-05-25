import express from "express";
import { register } from '../database';

export function registerRouter() {
  const router = express.Router();

  router.get('/', async (req, res) => {
    res.render('',  {message: ""});
  });

  router.post('/', async (req, res) => {
    const { email, password } = req.body;
    try {
      await register(email, password)
      res.redirect("login");
    } catch (error: any) {
      res.render("", { message: error })
    }
  });
  return router;
}