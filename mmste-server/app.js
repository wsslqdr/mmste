let express = require("express")
let bodyParser = require("body-parser")
let path = require("path")
let router = require('./router')

let app = express();

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json())

app.use('/public/', express.static(path.join(__dirname, "./public/")))

app.use("/node_modules/", express.static(path.join(__dirname, "./node_modules/")))

app.use(router)

app.listen(3000, () => {
    console.log("running at 3000")
})