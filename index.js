const CONNECTION_URL = "mongodb+srv://raja:satya9441@cluster0-ktntx.mongodb.net/zen3tasks?retryWrites=true&w=majority";
const express = require("express");
const mongoose = require("mongoose");
let connection = null;
const port = 3000;

const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var dataSchema = new mongoose.Schema({
    keyword: String,
    lastName: String,
    should_match: Array,
    Should_not_match: Array
});
mongoose.Promise = global.Promise;

var Zen3data = mongoose.model("zen3datas", dataSchema);

app.post("/add", (req, res) => {
    var data = new Zen3data({ //Need to replace the data with req.body to get params from frontend
        keyword: "-------",
        lastName: "---------",
        should_match: [],
        Should_not_match: []
    });
    data.save()
        .then(item => {
            res.status(200).send({
                data: item,
                message: "Record saved to database",
                status: "success"
            });
        })
        .catch(err => {
            res.status(400).send({
                error: err,
                message: "Unable to save to database",
                status: "failure"
            });
        });
});

app.get("/find/:id", async (req, res) => {
    const prom = new Promise((resolve, reject) => {
        Zen3data.find({ _id: req.params.id }, function (err, docs) {
            if(err) {
                reject({
                    message: "Unable to fetch",
                    status: "failed"
                })
            } else {
                resolve({
                    data: docs,
                    status: "Success"
                })
            }
        });
    });
    prom.then(d => {
        res.status(200).send(d)
    }).catch(e => {
        res.status(400).send(e)
    })
});


app.put("/update/:id", (req, res) => {
    Zen3data.findByIdAndUpdate(req.params.noteId, {
        keyword: req.body.title || "NEw Keyword"
    }, { new: true })
    .then(d => {
        if (!d) {
            return res.status(404).send({
                message: "Rcord ID not found with " + req.params.noteId,
                status: "failure"
            });
        } else {
            res.status(200).send({
                message: "",
                data: d,
                status: "success"
            })
        }
    }).catch(e => {
        return res.status(404).send({
            message: "Rcord ID not found with " + req.params.noteId,
            status: "failure"
        });
    });
});


app.delete("/delete/:id", (req, res) => {
    Zen3data.findByIdAndRemove(req.params.noteId)
        .then(d => {
            if (!d) {
                return res.status(404).send({
                    message: "Record Unable to delete" + req.params.noteId,
                    status: "failure"
                });
            } else {
                res.status(200).send({
                    message: "Record Deleted",
                    status: "success"
                })
            }
        }).catch(e => {
            return res.status(404).send({
                message: "Rcord ID not found with " + req.params.noteId,
                status: "failure"
            });
        });
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});