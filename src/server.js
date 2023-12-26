import express from "express";
import morgan from "morgan";

const PORT = 4000;

// app create
const app = express();

const globalRouter = express.Router();
const userRouter = express.Router();
const videoRouter = express.Router();

app.use("/", globalRouter);
app.use("/vedeos", videoRouter);
app.use("user", userRouter);



const gossipMiddleware = (req, res, next) =>
{
    console.log(`${req.method} ${req.url}`);
    next();
}

const privateMiddleware = (req, res, next) =>
{
    const url = req.url;
    if(url === "/protected")
    {
        return res.send("<h1>Not Allowed</h1>");
    }
   
    console.log("Allowed, you may continue.");
    next();
}

// handle function에는 request, response 오브젝트가 넘어온다.
const handleHome = (req, res) => 
{
    return res.send("Hello");
}

const handleLogin = (req, res) => 
{
    return res.send("<h1>login</h1>");
}

const handleProtected = (req, res) =>
{
    return res.send("handleProtected");
}
const routerLogger = (req, res, next) =>
{
    return res.send("www");
}

const methodLogger = (req, res, next) =>
{
    next();
}

const logger = (req, res, next) =>
{
    next();
}

const login = (req, res) =>
{
    return res.end();
}

const loggerMiddleware = morgan("common");

app.use(loggerMiddleware);

// global middleware
app.use(gossipMiddleware);
app.use(privateMiddleware);

// get 방식의 req를 받고 res 함수를 답해준다.
app.get("/", gossipMiddleware, handleHome);
app.get("/login", methodLogger, routerLogger, login);
app.get("/protected", handleProtected);

const handleListening = () => console.log(`http://localhost:${PORT}`);

app.listen(PORT, handleListening);

