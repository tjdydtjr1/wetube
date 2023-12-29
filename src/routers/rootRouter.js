import express from "express";
import {getJoin, postJoin, getLogin, postLogin} from "../controllers/userController";
import {home, search} from "../controllers/videoController";


const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);

// 로그인 주체 -> User
rootRouter.route("/login").get(getLogin).post(postLogin);

rootRouter.get("/search", search)

// 변수를 익스포트 하는 방법
// ㄴ 외부에서 쓰기 위함
export default rootRouter;

