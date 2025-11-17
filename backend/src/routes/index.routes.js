// src/routes/index.routes.js
import express from "express";
import blogRoutes from "./blog.routes.js";
// import other routers...
const router = express.Router();

router.use("/blog", blogRoutes);

// other router mounts...
export default router;
