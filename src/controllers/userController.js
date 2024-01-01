import User from "../models/User"
import fetch from "node-fetch";
import bcrypt from "bcrypt";


export const getJoin = (req, res) => 
{
    res.render("join", {pageTitle: "Join"});
}

export const postJoin = async (req, res) => 
{
    console.log(req.body);
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
    const ok = await bcrypt.compare(password, user.password);
  
    if(!user)
    {
        return res.status(400).render("login", 
        {
            pageTitle: "Login", 
            errorMessage: "An account with this username does not exists."
        });
    }
    
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
    console.log(config);
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

    res.send(JSON.stringify(json));
}

export const logout = (req, res) =>
{
    req.session.destroy();
    return res.redirect("/");
}

export const getEdit = (req, res) =>
{
    return res.render("edit-profile", {pageTitle: "Edit Profile"});
}

export const postEdit = async (req, res) =>
{
    const {session: {user: {_id}}} = req;
    const {name, email, username, location} = req.body;
    const updateedUser = await User.findByIdAndUpdate(_id, 
        {
            name: name,
            email: email,
            username: username,
            location: location
        },
        {
            new: true
        });
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

    return res.redirect("/users/logout");
}

export const see = (req, res) =>
{
    res.send("See User");
}