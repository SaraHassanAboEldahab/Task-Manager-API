const express = require('express')
const User = require('../models/user')
const sharp=require("sharp")
const auth = require("../middleware/auth")
const {sendWelcomeEmail,sendGoodBye}=require("../emails/account")
const multer = require("multer")
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})


router.post("/users/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/users/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        req.user.remove()
        sendGoodBye(req.user.email,req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {//originalname will allow us to get the name of the file or image
            return cb(new Error("only images are accepted"))

        }
        cb(undefined, true)
    }
})

//hena l fekra n badl makan by3ml save lel images fel avatar folder , han5lyh y3mlhom save fel db w 3shan a3ml access lel images d l hya btb2a binary byb2a 3n tary2 (req.file.buffer)
router.post("/users/me/avatar", auth, upload.single("avatar"), async (req, res) => {
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {//this function to handle any error , w d afdal l2n kda l error haygyly ka json msg fel body, lakn elawl kan bytktb fel html fe wst 7agat kter
    res.status(400).send({ error: error.message })
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get("/users/:id/avatar", async(req,res)=>{
    try{
const user = await User.findById(req.params.id)
if(!user || !user.avatar){
    throw new Error()
}
//fel 3ady lw brg3 json data => express automatically sets the Content-Type header equal to (application/json)
//but here we won't send json back na harg3 image w 3shan kda han7tag n3ml set lel content type header
    res.set("Content-Type","image/jpg")
    res.send(user.avatar)
}catch(e){
    res.status(404).send()

    }
})

module.exports = router