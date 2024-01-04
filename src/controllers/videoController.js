import User from "../models/User";
import Video from "../models/Video";

// callback 방식
// export const home = (req, res) => 
// {
//     console.log("Starting Search")
//     // find 변경됨 -> promise 반환 .then catch 사용
//     Video.find({}).then((videos) => 
//     {
//         console.log("Finished");
//         // find가 끝나면 render
//         return res.render("home", {pageTitle: "Home", videos: videos});
//     }).catch((error) => 
//     {
//         console.log("errors", error);
//     });
// }

// async 함수 
// ㄴ 내부 await
// try catch를 통한 에러 예외처리
export const home = async(req, res) =>
{
    const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
}

export const watch = async (req, res) =>
{
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner");

    if(!video)
    {
        return res.render("404", {pageTitle: "Video not found"});
    }
    return res.render("watch", {pageTitle: video.title, video});
}

export const getEdit = async (req, res) =>
{
    const {id} = req.params;
    const {user: {_id}} = req.params;
    const video = await Video.findById(id);
    // 에러 예외 처리
    if(!video)
    {
        return res.status(404).render("404", {pageTitle: "Video not found"});
    }
    if(String(video.owner) !== String(_id))
    {
        return res.status(403).redirect("/");
    }

    return res.render("edit", {pageTitle: `Editing ${video.title}`, video});
}

export const postEdit = async (req, res) =>
{
    const {user: {_id}} = req.session;
    const {id} = req.params;
    const {title, description, hashtags} = req.body;

    const video = await Video.exists({_id: id});
    
    // 에러 예외 처리
    if(!video)
    {
        return res.status(404).render("404", {pageTitle: "Video not found"});
    }
    if(String(video.owner) !== String(_id))
    {
        return res.status(403).redirect("/");
    }
    await video.findByIdAndUpdate(id, 
        {
            title,
            description,
            hashtags: Video.formatHashtags(hashtags)
        });

    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) =>
{
    return res. render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) =>
{
    const {user: {_id}} = req.session;
    // 1. const file = req.file;
    // 2. const {path: fileUrl} = req.file;
    // 하나일 땐 req.file => 여러개는 files
    const {video, thumb} = req.files;
    const {title, description, hashtags} = req.body;

    console.log(thumb);
    try
    {
        await Video.create
        (
            {
                title,
                description,
                fileUrl: video[0].path,
                thumbUrl: thumb[0].path,
                owner: _id,
                hashtags : Video.formatHashtags(hashtags)
            }
        );
        const user = await User.findById(_id);
        user.videos.push(new Video._id);
        user.save();

        return res.redirect("/");
    }
    catch(error)
    {
        return res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error.message});
    }
}

export const deleteVideo = async(req, res) =>
{
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video)
    {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    
    if(String(video.owner) !== String(_id))
    {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    //delete videos
    return res.redirect("/");
}

export const search = async(req, res) =>
{
    const {keyword} = req.query;
    let videos = [];

    if(keyword)
    {
        videos = await Video.find
        (
            {
                title: 
                {
                    $regex: new RegExp(`${keyword}$`, "i")
                }
            }
        ).populate("owner");
    }
    return res.render("search", {pageTitle: "Search", videos});
}

export const registerView = async (req, res) =>
{
    const {id} = req.params;
    const video = await Video.findById(id);
    
    if(!video)
    {
        // status만 보내면 상태 코드만 보냄
        // sendStatus 상태 코드와 연결을 끝냄
        return res.sendStatus(404)
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}
