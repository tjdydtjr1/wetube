import express from "express";
import {watch, getEdit, postEdit, getUpload, postUpload, deleteVideo} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();


// 변수 사용하는 애들은 밑으로
// ㄴ 정규표현식을 이용한 방법으로 해결가능
// ㄴ \\d+ 숫자모든것
videoRouter.get("/:id([0-9a-f]{24})", watch);

// get post 방식을 하나로 묶는 방법
//videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo);

videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).
// single -> 하나만 보낼때 (영상)
// fields => 여러개를 보낼때 (영상, 사진 등등)
post(videoUpload.fields(
[
    {
        name: "video", maxCount: 1
    },
    {
           name: "thumb", maxCount: 1
    }
]), postUpload);

export default videoRouter;