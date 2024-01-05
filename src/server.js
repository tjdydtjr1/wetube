require("dotenv").config();
import "./db"
import "./models/Video";
import express from "express";
import flash from "express-flash"
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from "./routers/apiRouter";




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

// 상태 코드 
app.use(logger);

// text를 이해하기 위해 사용함 req.body에 text도 담기게 됨
// app.use(express.text()); -> string으로만 변환해줌   => JSON.stringify(string 변환할 오브젝트)
// text가 아닌 json을 사용하면 string을 json으로 변환까지 해줌 => JSON.parse(string 변환된 것)
app.use(express.json());


app.use(express.urlencoded({extended: true}));

// 세션은 Route 전에
app.use(session(
    {
        secret: process.env.COOKIE_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: 
        {
            maxAge: 2000000000,
        },
        store: MongoStore.create({mongoUrl: process.env.DB_URL})
    }
));

app.use((req, res, next) =>
{
    req.sessionStore.all((error, sessions) =>
    { 
        console.log(sessions);
        next();
    })
})

// express-flash 설치시 req,flash 사용가능
app.use(flash());
// 경로에 올 시 라우터 실행
app.use(localsMiddleware);
app.use("/", rootRouter);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;

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


