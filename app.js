const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const multer = require("multer");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.listen(3000, (req, res) => {
    console.log("server is on using port 3000");
})


//////////////multer////////////////////////////

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/imags/animals")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + file.originalname)
    }
});

let upload = multer({ storage: storage })

/////////////////////dataBase///////////////////

mongoose.connect("mongodb://localhost:27017/animals", { useUnifiedTopology: true, useNewUrlParser: true });

const animalSchema = mongoose.Schema({
    name: String,
    description: String,
    image: String,
    type: String,
    age: Number,
    health: String
});

const animalModel = mongoose.model("animal", animalSchema);

///////////////////get/////////////////
app.get("/", (req, res) => {
    res.render(__dirname + "/mainPages/index.ejs");
})
app.get("/dogs", (req, res) => {
    animalModel.find({ type: "dog" }, (err, doc) => {
        if (doc) {
            res.render(__dirname + "/mainPages/dogs.ejs", { animals: doc });
        }
    })
})
app.get("/cats", (req, res) => {
    animalModel.find({ type: "cat" }, (err, doc) => {
        if (doc) {
            res.render(__dirname + "/mainPages/dogs.ejs", { animals: doc });
        }
    })
})
app.get("/others", (req, res) => {
    animalModel.find({ type: "other" }, (err, doc) => {
        if (doc) {
            res.render(__dirname + "/mainPages/dogs.ejs", { animals: doc });
        }
    })
})
app.get("/add", (req, res) => {
    res.render(__dirname + "/mainPages/add.ejs");
})

app.get("/remove", (req, res) => {
    animalModel.find((err, doc) => {
        if (doc) {
            res.render(__dirname + "/mainPages/remove.ejs", { animals: doc });
        }
    })
})


///////////////post//////////////////////


app.post("/add", upload.single("pic"), (req, res) => {

    const animal = new animalModel({
        name: req.body.animalName,
        description: req.body.animalDiscription,
        image: req.file.filename,
        type: req.body.type,
        age: req.body.animalAge,
        health: req.body.animalHealth
    })
    animal.save();
    res.redirect("/add");
})

app.post("/animal", (req, res) => {
    animalModel.findById(req.body.animalId, (err, doc) => {
        res.render(__dirname + "/mainPages/animal.ejs", { animal: doc });
    })
})
app.post("/removeAnimal", (req, res) => {
    animalModel.findOneAndDelete(req.body.animalId, (err, doc) => {
        res.redirect("/remove");
    })
})

app.post("/message", (req, res) => {
    console.log("hello");
    res.redirect("/");
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       user: 'youremail@gmail.com',
    //       pass: 'yourpassword'
    //     }
    //   });

    //   var mailOptions = {
    //     from: 'youremail@gmail.com',
    //     to: 'myfriend@yahoo.com',
    //     subject: 'Sending Email using Node.js',
    //     text: 'That was easy!'
    //   };

    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //     }
    //   });
})


