import express from "express";
import {edit, remove, logout, see, startGithubLogin} from "../controllers/userController";

const userRouter = express.Router();


userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/delete", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get(":id", see);

// 변수 하나만을 위한 익스포트 시 이름 변경 가능
export default userRouter;