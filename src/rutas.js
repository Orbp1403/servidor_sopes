const { json } = require('express')
var clientemongo = require('mongodb').MongoClient;
var uri = 'mongodb://localhost/proyecto1sopes1';
var devolver = "";
var db;
clientemongo.connect(uri, (err, cliente) => {
    if (err) throw err;
    db = cliente.db('proyecto1sopes1');
})

const router = require('express').Router()

// * METODO DE PRUEBA
router.get('/', (req, res, next) => {
    console.log("Servidor funcionando")
    clientemongo.connect(uri, function(err, db){
        console.log("conectado")
    })
    res.send("Correcto")
})

// * METODO QUE RECIBE LOS DATOS DE LOS SERVIDORES
router.post('/postdatos', async (req, res) => {
    console.log(req)
    try{
        let collection = db.collection("Personas")
        await collection.insertOne(req.body)
        res.json("correcto")
    }catch(err){
        res.status(500).json({'message' : 'failed'})
    }
})

// * METODO QUE DEVUELVE LOS DATOS 
router.get('/getdatos', async (req, res) => {
    try{
        const resultado = await db.collection('Personas').find().toArray();
        await res.send(resultado)
    }catch(error){
        res.status(500).json({'message' : 'failed'})
    }
})
module.exports = router