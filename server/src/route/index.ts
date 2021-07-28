import express from "express";
import test from "./test";
import user from "./user";
import project from "./project";
import data from "./data";

const router = express.Router();

router.use("/", test);
router.use("/user", user);
router.use("/project", project);
router.use("/data", data);

export default router;
