import User from "../models/User"
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
                password,
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

export const remove = (req, res) => 
{
    res.send("Remove User");
}

export const getLogin = (req, res) =>
{
    res.render("login");
}

export const postLogin = async (req, res) =>
{
    const {username, password} = req.body;
    const user = await User.findOne({username:username});
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
        client_id: "7e9f42a4385f11d4724b",
        allow_signup: false,
        scope: "read:user user:email"
    };
    const params = new URLSearchParams(config).toString();

    const finalUrl = '${baseUrl}?${params}';

    return res.redirect(finalUrl);
}

export const logout = (req, res) =>
{
    res.send("Log Out");
}

export const see = (req, res) =>
{
    res.send("See User");
}