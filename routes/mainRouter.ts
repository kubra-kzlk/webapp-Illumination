import express from "express";

export function mainRouter() {
    const router = express.Router();

    router.get("/main", async(req, res) => {
        res.render("main",{page:'home'});
    });

    return router;
}