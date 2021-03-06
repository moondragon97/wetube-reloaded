import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";
import Video from "../models/Video";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async(req, res) => {
    const {name, username, email, password, password2,location} = req.body;
    const pageTitle = "Join";
    if(password !== password2){
        return res.status(400).render("join",
        {pageTitle,
        errorMessage: "Password confirmation does not match.",
        });
    }
    const exists = await User.exists({$or: [{username:req.body.username}, {email:req.body.email}]});
    if(exists){
        return res.status(400).render("join",
        {pageTitle,
        errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    }catch(error){
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error,
        });
    }
};
export const getLogin = (req, res) => 
res.render("login", 
{pageTitle: "Login"});

export const postLogin = async(req, res) => {
    const {username, password} = req.body;
    const pageTitle = "Login";
    const user = await User.findOne({username, socialOnly: false});
    if(!user){
        return res.status(400).render("login", {pageTitle, errorMessage:"An account with this username does not exists"});
    }
    const ok = await bcrypt.compare(password, user.password);
    if(!ok){
        return res.status(400).render("login", {
            pageTitle,
            errorMessage: "Wrong Password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
}

export const startGithubLogin = (req, res) =>{
    const baseUrl = `https://github.com/login/oauth/authorize`;
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    
    return res.redirect(finalUrl);
};

// ----------Github Login-----------
export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token"
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (await fetch(finalUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    })).json();
    if("access_token" in tokenRequest){
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com"
        const userData = await (
            await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        })).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailObj){
            req.flash("error", "email??? ?????? ????????? ?????? ???????????????.");
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailObj.email});
        if(!user){
            const user = await User.create({
                avatarUrl: userData.avatar_url,
                name: userData.name ? userData.name : userData.login,
                username: userData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userData.location,
            });
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else{
        return res.redirect("/login");
    }
};

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: {_id, avatarUrl},      // const id = req.session.user.id;
        },
        body: {name, email, username, location},
        file,    //const {name, email, username, location} = req.body;
    } = req;
    

    // -----Code Challenge-----
    const pageTitle = "Edit Profile";
    const {user} = req.session;
    const usernameExists = user.username === username ? false : await User.exists({username: user.username})
    const emailExists = user.email === email ? false : await User.exists({email: user.email})
    if (usernameExists || emailExists) {
        return res.status(400).render("edit-profile", {
            pageTitle,
            errorMessage: "This username/Email is already taken.",
        });
    }
    // ------------------------
    const isHeroku = process.env.NODE_ENV === "production";
    const updateUser = await User.findByIdAndUpdate(_id, {
        avatarUrl: file ? (isHeroku ? file.location : file.path) : avatarUrl, 
        name: name, email: email, username: username, location: location
    }, {new: true});
    
    req.session.user = updateUser;
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly){
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle: "Change Password"});
};

export const postChangePassword = async (req, res) => {
    const {oldPassword, newPassword, newPasswordConfirmation} = req.body;
    const {
        session: {
            user: {_id},
        },
        body: {name, email, username, location},
    } = req;
    const user = await User.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password)
    if(!ok){
        return res.status(400).render("users/change-password", {pageTitle: "Change Password", errorMessage: "The current password is incorrect",}); // ?????? ??????????????? old ??????????????? ????????????
    }
    if(newPassword !== newPasswordConfirmation){
        return res.status(400).render("users/change-password", {pageTitle: "Change Password", errorMessage: "The password does not match the confirmation",});
    }
    user.password = newPassword;
    await user.save();
    return res.redirect("/users/logout");
}

export const see = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id).populate({
        path: "videos",
        populate: {
            path: "owner",
            model: "User",
        },
    });
    if(!user){
        return res.status(404).render("404", {pageTitle:"User not found."});
    }
    return res.render("users/profile", {pageTitle: user.name, user});
}