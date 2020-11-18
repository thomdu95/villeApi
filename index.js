const express = require("express")
const cors = require("cors")
const fs = require("fs")

let api = express()
api.use(cors())
api.use(express.json())
api.use(express.urlencoded({extended: true}))

let parsedVilles = []
async function fetchVilles() {
    let villes = fs.readFileSync("./ville.json")
    parsedVilles = await JSON.parse(villes)
    console.log("Finis de fetch les villes")
}

fetchVilles()

api.get("/all", (req, res) => {
    res.json(parsedVilles)
})

api.get("/villes/:numberOf", (req, res) => {
    res.json(parsedVilles.slice(0, req.params.numberOf))
})

api.get("/name/:startBy", (req, res) => {
    res.json(parsedVilles.filter(elem => elem["Nom_commune"].startsWith(req.params.startBy.toUpperCase())))
})

api.get("/region/:code", (req, res) => {
    if (req.params.code.length >= 2 && req.params.code.length <= 5) {
        res.json(parsedVilles.filter(elem => elem["Code_postal"].toString().startsWith(req.params.code)))
    } else {
        res.status(203).send("Bad Code, should contains between 2 and 5 numbers only")
    }
})



api.listen(process.env.PORT || 8080, () => {
    console.log("Listening on http://localhost:8080")
})