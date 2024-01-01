import express, { json } from "express";
import {edit, logout,
     see, startGithubLogin, finishGithubLogin, postEdit, getEdit, getChangePassword, postChangePassword} from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware } from "../middlewares";
import app from './../server';

const userRouter = express.Router();

userRouter.get("/logout", protectorMiddleware, logout);
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get(":id", see);

// 변수 하나만을 위한 익스포트 시 이름 변경 가능
export default userRouter;
 