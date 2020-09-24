const mongoose = require('mongoose')

                    ////////// 4. Environment Variables //////////

//here we will provide the environment variables to our node app when it runs locally on our machine
//l fekra hena fel mongodb url, because when we run our app locally it connects with the local db w da l kona sha8len beh
//but when we want to deploy our app on heroku then it will try to connect to our local db and that will failed because db won't be existed
//so when we deploy our app to heroku, we will use another service to setup a professional mongodb (aw y3ny ha3ml setup le env. variable)

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true 
})