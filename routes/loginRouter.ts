import express from 'express';
import { User } from '../types';
import { login } from '../database';
import { secureMiddleware } from '../secureMiddleware';

export function loginRouter() {
    const router = express.Router();

    router.get("/login",  (req, res) => {
        res.render("login");
    });

    //D4: gb inloggen en in sessie data zetten. w8W w verwijderd
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;
        try {
            let user: User = await login(email, password);
            delete user.password;
            req.session.user = user;
            res.redirect("/main");
        } catch (e: any) {
            res.redirect("/login");
        }
    });
    //logout knop in header, verwijst nr de login pag
    router.post("/logout",secureMiddleware, async (req, res) => {
        req.session.destroy(() => {
            res.redirect("/login");
          });
    });

    return router;
}