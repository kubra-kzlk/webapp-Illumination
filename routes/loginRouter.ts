import express from 'express';
import { User } from '../types';
import { login } from '../database';

export function loginRouter() {
    const router = express.Router();

    router.get("/login", async (req, res) => {
        res.render("login");
    });

    //D4: gb inloggen en in sessie data zetten. w8W w verwijderd
    router.post("/login", async (req, res) => {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            // req.session.message = { type: "error", message: "Email and password are required" };
            return res.redirect("/login");
        }

        try {
            let user: User = await login(email, password);
            delete user.password;
            // req.session.user = user;
            res.redirect("/main");
        } catch (e: any) {
            console.log("login error: ", e);
            res.redirect("/login");
        }
    });

    router.post("/logout", async (req, res) => {
        req.session.destroy((err) => {
            if (err) {
              console.error("Session destruction error: ", err);
              return res.redirect("/main");
            }
            res.redirect("/login");
          });
    });

    return router;
}