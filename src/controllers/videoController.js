import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async(req, res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
    return res.render("home", {pageTitle:"Home", videos});
};
export const watch = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id).populate("owner").populate("comments");   // populate를 이용해서 owner에 있는 User의 데이터들을 가져온다.
    if(video === null){
        return res.render("404", {pageTitle: "Video not found."});
    }
    return res.render("watch", {pageTitle: video.title, video});
}

export const getEdit = async (req, res) => {
    const {id} = req.params;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(video === null){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(video.owner != _id){
        req.flash("error", "You are not the owner of the video.");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Edit: ${video.title} `, video});
};

export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;
    const {user: {_id}} = req.session;
    const video = await Video.findById(id);
    if(!video){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(video.owner != _id){
        req.flash("error", "Not authorized");
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,description, hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res) => {
    const {user: {_id}} = req.session;
    const {video, thumb} = req.files;
    const {title, description, hashtags} = req.body;
    try{
        const newVideo = await Video.create({
            title: title,
            description,
            fileUrl: video[0].path,
            thumbUrl: thumb[0].path,
            owner: _id,
            hashtags: Video.formatHashtags(hashtags),
        });
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    }catch(error){
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
}

export const deleteVideo = async(req, res) =>{
    const {id} = req.params;
    const {user: {_id}, user} = req.session;
    const video = await Video.findById(id).populate("owner");
    const owner = video.owner;
    if(video === null){
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(owner._id != _id){
        return res.status(403).redirect("/");
    }
    const {videos} = owner;
    await videos.splice(videos.indexOf(id),1);
    await Video.findByIdAndDelete(id);
    owner.save();
    return res.redirect("/");
};

export const search = async(req,res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword){
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle: "Search", videos});
};

export const registerView = async (req, res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
};

export const createComment = async (req, res) => {
    const{
        session: {user},
        body: {text},
        params: {id},
    }=req;
    
    const video = await Video.findById(id);
    if(!video){
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text,
        owner: user._id,
        video: id,
    });
    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({newCommentId: comment._id});
};

export const deleteComment = async (req, res) => {
    const{
        session: {user},
        params: {id},
    }=req;

    const comment = await Comment.findById(id).populate("video");
    if(user._id != comment.owner){
        return res.sendStatus(404);
    }
    const videoId = comment.video._id;
    const video = await Video.findById(videoId);
    await video.comments.pop({_id: id});
    await video.save();
    await Comment.findByIdAndDelete(id);
    return res.sendStatus(200);
};

export const editComment = async (req, res) => {
    const{
        session: {user},
        params: {id},
        body: {text},
    }=req;
    const comment = await Comment.findById(id)
    if(user._id != comment.owner){
        return res.sendStatus(404);
    }
    await Comment.findByIdAndUpdate(id, {
        text,
    });
    return res.sendStatus(200);
};