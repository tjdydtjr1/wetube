import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";



const PORT = 4000;

// app create
const app = express();
const logger = morgan("dev");

// const globalRouter = express.Router();
// const userRouter = express.Router();
// const videoRouter = express.Router();

// view engine 설정 => express 에서 html을 리턴하기 위해 사용
app.set("view engine", "pug");

// pug 폴더 설정법
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}));

// 경로에 올 시 라우터 실행
app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/user", userRouter);



// const gossipMiddleware = (req, res, next) =>
// {
//     console.log(`${req.method} ${req.url}`);
//     next();
// }

// const privateMiddleware = (req, res, next) =>
// {
//     const url = req.url;
//     if(url === "/protected")
//     {
//         return res.send("<h1>Not Allowed</h1>");
//     }
   
//     console.log("Allowed, you may continue.");
//     next();
// }



// const handleLogin = (req, res) => 
// {
//     return res.send("<h1>login</h1>");
// }

// const handleProtected = (req, res) =>
// {
//     return res.send("handleProtected");
// }
// const routerLogger = (req, res, next) =>
// {
//     return res.send("www");
// }

// const methodLogger = (req, res, next) =>
// {
//     next();
// }

// const logger = (req, res, next) =>
// {
//     next();
// }

// const login = (req, res) =>
// {
//     return res.end();
// }

// const loggerMiddleware = morgan("common");

// app.use(loggerMiddleware);

// // global middleware
// app.use(gossipMiddleware);
// app.use(privateMiddleware);

// // get 방식의 req를 받고 res 함수를 답해준다.
// app.get("/", gossipMiddleware, handleHome);
// app.get("/login", methodLogger, routerLogger, login);
// app.get("/protected", handleProtected);

 const handleListening = () => console.log(`http://localhost:${PORT}`);

app.listen(PORT, handleListening);

