const User = require("../models/user");

exports.login = (req,res)=>{
    res.send("Logged !");
}

exports.register = (req,res)=>{

    let user = new User({
        name: "Hatim",
        mail: "hatim@mail.com",
        password: "fuckoff"
    })
    user.save((err, doc) => {
        res.send(doc);
    })

}

exports.signOut = (req,res)=>{
    res.send("Signed out !");
}
