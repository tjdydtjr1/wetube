import mongoose from "mongoose";

// mongodb://127.0.0.1:27017/DB이름
mongoose.connect(process.env.DB_URL);

// mongoDB 연결
const db = mongoose.connection;

const handleOpen = () => console.log("Connented to DB");
const handleError = (error) => console.log("DB Error", error);

// 계속 실행
db.on("error", handleError);

// open시 한번 실행
db.once("open", handleOpen);

