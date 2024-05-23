import express from "express";

export function homeRouter() {
    const router = express.Router();

    router.get("/main", async(req, res) => {
        res.render("main",{page:'home'});
    });

    return router;
}