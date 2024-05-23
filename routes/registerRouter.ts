import express from "express";
import { register } from '../database';


export function registerRouter(){
    const router = express.Router();

      router.get('/', async (req, res) => {
        res.render('', {});
      });

      router.post('/', async (req, res) => {
        const { email, password} = req.body;
        try {
            const userId = await register(email,password)
            res.redirect("login"); 
        } catch (error: any) {
            res.render("index", {message:error})
        }
      });
    return router;
}