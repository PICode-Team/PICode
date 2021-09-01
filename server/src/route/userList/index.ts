import express from "express";
import userList from "./userList";

const router = express.Router();

router.use("/", userList);

export default router;
