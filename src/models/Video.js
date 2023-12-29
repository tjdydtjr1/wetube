import mongoose from "mongoose";

// DB에 형태를 정해줘야한다.
const videoSchema = new mongoose.Schema
(
    {
        title: {type: String, required: true, trim: true, maxLength: 80},
        description: {type: String, required: true, trim: true, minLength: 20},
        createdAt: {type: Date, required: true, default: Date.now},
        hashtags: [{type: String, trim: true}],
        meta : 
        {
            views: {type: Number, default: 0, required: true},
            rating: {type: Number, default: 0, required: true}
        },
    }
);

// import 할 필요없이 쓰는 법
videoSchema.static('formatHashtags', function (hashtags)
{
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
}
);

// model 생성전에 실행
// videoSchema.pre("save", async function()
// {
//     this.hashtags = this.hashtags[0].split(",").map((word) => word.startsWith("#") ? word : `#${word}`);
// });

// model create
const Video = mongoose.model("Video", videoSchema);
export default Video;




// const video =
// {
//     title: "Heki",
//     description: " dsds",
//     createAt: 121212,
//     hashtags: ["#hi", "#hello"]
// }