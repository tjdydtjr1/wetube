import express from "express";
import {join, login} from "../controllers/userController";
import {trending, search} from "../controllers/videoController";


const globalRouter = express.Router();

globalRouter.get("/", trending);
globalRouter.get("/join", join);

// 로그인 주체 -> User
globalRouter.get("/login", login);


// 변수를 익스포트 하는 방법
// ㄴ 외부에서 쓰기 위함
export default globalRouter;

