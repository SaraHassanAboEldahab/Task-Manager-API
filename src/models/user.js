const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const Task = require("../models/task")

//mongoose convert the object(zay l user hena) behind the scene into schema ,here we create it directly as separate schema and separate model to take advantage of middleware
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, //3shan mayb2ash kaza user nfs l email ,kda kol user leh unique email for him.
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    //tokens hena subDocument of each document in user collection or model , wel id hena hayba nfs l id bta3 l user nfso ^_^
    tokens: [{//we store tokens in db to allow users login from more than one device
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
}, {
    //when we create a new user, it will be  created with two additional fields allowing us to track when this user is created and when it was last updated
    // y3ny kda ama a3ml creation l user gdid hyb2a zyada 3alih 2 fields w homa => createdAt and updatedAt
    timestamps: true //l default byb2a false
})

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner"
})

//here we use middleware to hashing passwords before saving users in db
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    //we call it to know that the code above is done ,if we don't call it the code will run forever and never save the document(user)
    //where here we call next to stop running the code then save the user after hashing his password
    next()
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error("this email doesn't exist")
    }
    const isMatched = await bcrypt.compare(password, user.password)//user.password da l fel db
    if (!isMatched) {
        throw new Error("u can't login")
    }
    return user
}
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({ token })
    user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj
}

//delete user tasks when user is removed
userSchema.pre("remove", async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User