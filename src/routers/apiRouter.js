import express from "express";
import { registerView } from "../controllers/videoController";

const apiRouter = express.Router();

//([0-9a-f]{24})
apiRouter.post("/videos/:id/view", registerView);

export default apiRouter;