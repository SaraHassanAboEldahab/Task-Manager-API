//// 8. Accepting Authentication Tokens //////

//the whole authentication process starts with the client taking that authentication token that they get from signing up or logging in and providing it with the request that they want to perform
//y3ny elmafrod l user hay3oz l token bta3o 3shan y2dr y3ml l process l hwa ha3yzha
//w 3shan y3ml da l mafrod hayb3t l token fel header bta3 l request, w fe l case d l token is known as Bearer token
//yb2a fel awl han3ml validation lel token w da tb3n bel jwt w b3den ngeb l user

const User = require("../models/user")
const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearar ","")//this the token that is in the header of the request from the user ( w da l hankano bel mogod fel db ),we used replace to remove Bearar word from the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)//if it's verified then it will be the token object which contains the id l han3rf mno l token da tb3 anhy user
        const user = await User.findOne({ _id: decoded._id, "tokens.token": token })//this user is user has the correct id and still has the authentication token , w da 3shan lw hwa 3ml logout msh hyb2a m3ah l token da
        if(!user){
            throw new Error()
        }
        req.token=token//w da 3shan a2dr ams7o lma l user y3ml logout
        req.user = user//here we give the route handler access to the user that we fetched from the database
        next()
    } catch(e){
        res.status(401).send({error:"please authenticate"})

    }
}
module.exports = auth

//el5olasa n l user ama y3ml sign up aw login bya5od token b3d kda l token da byb2a hwa l 7aga l hyt3ml beha authentication w byb2a fel header bta3 ay request hay3mlo fema b3d, 3shan masln y2dr yshof l profile bta3o aw y3ml ay process hwa 3ayzha zy eno yms7 task