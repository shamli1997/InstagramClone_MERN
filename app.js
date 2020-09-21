const express = require('express')
const app = express()
const mongoose = require('mongoose')
const PORT = process.env.PORT || 5000
const { MONGOURI } = require('./config/keys')


mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true

})
mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})
mongoose.connection.on('error', (err) => {
    console.log("err connecting ", err)
})

//register a User model
require('./models/user')
require('./models/post')

/* express server does'nt automatically parse
req to json
this is kind of middleware which takes req and parse into json */
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))

/* creating middleware
1.What is middleware?
   code that takes incoming req and modify it 
   before it reaches actual route handler 
const customMiddleware = (req, res, next) => {
   console.log("middleware executed!!")
   next() 
}

pass middleware to app.use()
as we are writing middleware in app.use 
it will be used for all the routes
app.use(customMiddleware)

when we are making request to '/' the middleware is executing first
and then this callback is being fired 

1.Where to use middleware
ex.If a person wants to access protected resource
so we'll be making a middleware let's say required login
user must be authenticated befire accessing the resource
so we'll create the middleware to detect if user is logged
in or not


//zkrswBKKQiknF3Bw
app.get('/', (req, res) => {
   console.log("Home")
   res.send("Hello world")
})

app.get('/about', customMiddleware, (req, res) => {
   console.log("About")
   res.send("About page")
})  */

//srrve static files html css  in build folder
if (process.env.NODE_ENV == "production") {
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log("server is running on ", PORT)
})