const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
//process.env => this where environment variables are stored
//and we access the port environment variable (l hwa PORT) which is provided by heroku when heroku runs our node application
//kda lw sh8ala locally hyb2a l port 3000 (development), w lw 3ala heroku yb2a l port bta3 heroku (production)
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})