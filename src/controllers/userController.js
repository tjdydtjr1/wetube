import User from "../models/User"
import Video from "../models/Video"
import fetch from "node-fetch";
import bcrypt from "bcrypt";


export const getJoin = (req, res) => 
{
    res.render("join", {pageTitle: "Join"});
}

export const postJoin = async (req, res) => 
{
    const {name, username, email, password1, password2, location} = req.body;
    const usernameExists = await User.exists({$or: [{username}, {email}]});

    if(password1 !== password2)
    {
        res.status(400).render("join", {pageTitle: "Join", errorMessage: "Password confirmation does not match."});
    }

    if(usernameExists)
    {
        res.status(400).render("join", {pageTitle: "Join", errorMessage: "This username/email is already taken."});
    }

    try
    {
        await User.create
        (
            {
                name,
                username,
                email,
                password: password1,
                location
            }
        )
        return res.redirect("/login");
    }
    catch (error)
    {
        return res.status(400).render("join", {pageTitle: "Upload Video", errorMessage: error._message});
    }
}

export const edit = (req, res) => 
{
    res.send("Edit User");
}


export const getLogin = (req, res) =>
{
    res.render("login");
}

export const postLogin = async (req, res) =>
{
    const {username, password} = req.body;
    const user = await User.findOne({username:username, socialOnly: false});
  
    if(!user)
    {
        return res.status(400).render("login", 
        {
            pageTitle: "Login", 
            errorMessage: "An account with this username does not exists."
        });
    }
    else
    {
        const ok = await bcrypt.compare(password, user.password);
        if(!ok)
        {
            return res.status(400).render("login", 
            {
                pageTitle: "Login", 
                errorMessage: "Wrong password"
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
    
        return res.redirect("/");
    }
    
}

export const startGithubLogin = (req, res) =>
{
    const baseUrl = "https://github.com/login/oauth/authorize";

    const config =
    {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email"
    };
    const params = new URLSearchParams(config).toString();

    const finalUrl = `${baseUrl}?${params}`;

    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) =>
{
    const baseUrl = "https://github.com/login/oauth/access_token";
    const apiUrl = "https://api.github.com";
    const config =
    {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await 
    (
        await fetch
        (
            finalUrl,
            {
                methpd: "POST",
                headers: 
                {
                    Accept: "application/json"
                }
            }
        )
    ).json();
    if("access_token" in tokenRequest)
    {
        const {access_token} = tokenRequest;
        const userRequest = await 
        (
            await fetch
            (
                `${apiUrl}/user"`,
                {
                    headers:
                    {
                        Authorization: `token ${access_token}`
                    }
                }
            )
        ).json();
        const userData = await (
            await fetch(`${apiUrl}/user`, {
              headers: {
                Authorization: `token ${access_token}`,
              },
            })
          ).json();
        const emailData = await
        (
            await fetch
            (
                `${apiUrl}/user/emails`,
                {
                    headers: 
                    {
                        Authorization: `token ${access_token}`
                    }
                }
            )
        ).json();
        const emailObj = emailData.find(email =>
        
            email.primary === true &&
            email.verified === true
        );

        if(!emailObj)
        {
            return res.redirect("/login");
        }

        let user = await User.findOne({email: emailObj.email});
        
        if(!user)
        {
            user = await User.create
            (
                {
                    avatarUrl: userData.avatar_Url,
                    name: userData.name,
                    username: userData.login,
                    email: emailObj.email,
                    passwrod: " ",
                    socialOnly: true,
                    location: userData.location
                }
            );
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
        else
        {
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }

    }
    else
    {
        return res.redirect("/login");
    }
}

export const logout = (req, res) =>
{
    req.session.destroy();
    // req.flash 알림 남길 수 있음
    req.flash("info", "Bye Bye");
    return res.redirect("/");
}

export const getEdit = (req, res) =>
{
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}

export const postEdit = async (req, res) =>
{
    const {session: {user: {_id, avatarUrl}}} = req;
    const {name, email, username, location, } = req.body;
    
    // 미들웨어에서 multer 거치면 req.file 생성됨
    const {file} = req;
    const updatedUser = await User.findByIdAndUpdate
    (
        _id, 
        {
            // DB에는 파일이아닌 파일 경로만 저장한다.
            avatarUrl: (file ? file.path : avatartUrl),
            name: name,
            email: email,
            username: username,
            location: location
        },
        {
            new: true
        }
    );
    req.session.user = updatedUser;
    return res.render("edit-profile");
}

export const getChangePassword = (req, res) =>
{
    if(req,session.user.socialOnly === true)
    {
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle: "Change Password"});
}

export const postChangePassword = async (req, res) =>
{
    // req.session.body
    const
    {
        session:
        {
            user: {_id},
        },
        body:
        {
            oldPassword,
            newPassword,
            newPasswordConfirmation
        }
    } = req;
    const user = await User.findById(_id);
    if(user.password === null)
    {
        return res.redirect("/users/login");
    }
    
    const ok = await bcrypt.compare(oldPassword, user.password);

    if(!ok)
    {
        return res.status(400).render("users/change-password",
        {
            pageTitle: "Change Password",
            errorMessage: "The current password is incorrect"
        });
    }


    if(newPassword !== newPasswordConfirmation)
    {
        return res.status(400).render("users/change-password",
        {
            pageTitle: "Change Password",
            errorMessage: "The Password does not match the confirmation"
        });
    }
    user.password = newPassword;
    
    // save pre
    await user.save();

    req.flash("info", "Password Updated");
    return res.redirect("/users/logout");
    
}


export const see = async (req, res) =>
{
    const {id} = req.params;
    //const user = await User.findById(id).populate("videos");
    const user = await User.findById(id).populate
    (
        {
            path: "videos",
            populate:
            {
                path: "owner",
                model: "User"
            }
        }
    );

    if(!user)
    {
        return res.status(404).render("404", {pageTitle: "User not found."});
    }
    const videos = await Video.find({owner: user.id})

    return res.render("profile", {pageTitle: user.name, user});
}