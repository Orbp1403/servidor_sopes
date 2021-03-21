const { json } = require('express')
var clientemongo = require('mongodb').MongoClient;
var uri = 'mongodb://localhost/proyecto1sopes1';
var devolver = "";
var db;
clientemongo.connect(uri, (err, cliente) => {
    if (err) throw err;
    db = cliente.db('proyecto1sopes1');
})

var regiones = [];
        for(var i = 0; i < 8; i++){
            var region = {
                nombre_region : "",
                cantidad_region : 0,
                departamentos : []
            }
            if(i == 0){
                region.nombre_region = "Region VI o Suroccidente"
                regiones.push(region)
            }else if(i == 1){
                region.nombre_region = "Region I o Metropolitana"
                regiones.push(region)
            }else if(i == 2){
                region.nombre_region = "Region VII o Noroccidente"
                regiones.push(region)
            }else if(i == 3){
                region.nombre_region = "Region V o Central"
                regiones.push(region)
            }else if(i == 4){
                region.nombre_region = "Region II o Verapaz"
                regiones.push(region)
            }else if(i == 5){
                region.nombre_region = "Region III o Nororiente"
                regiones.push(region)
            }else if(i == 6){
                region.nombre_region = "Region IV o Suroriente"
                regiones.push(region)
            }else{
                region.nombre_region = "Region VIII o Peten"
                regiones.push(region)
            }
        }

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
        const resultado = await db.collection('Personas').find({}).project({'_id': 0}).sort({_id: -1}).toArray();
        await res.send(resultado)
    }catch(error){
        res.status(500).json({'message' : 'failed'})
    }
})

// * METODO QUE DEVUELVE LOS DATOS GUARDADOS DESDE LOS SERVIDORES
router.get('/getdatos/:server', async (req, res) => {
    try{
        const resultado = await db.collection('Personas').find({way : req.params.server}).toArray();
        console.log(resultado)
        res.send(resultado)
    }catch(error){
        res.status(500).json({'message' : 'failed'})
    }
})

// * METODO QUE DEVUELVE LA REGION MAS INFECTADA
router.get('/regionmasinfectada', async (req, res) =>{
    try{
        const fieldname = "location"
        const query = {}
        // * SE OBTIENEN TODOS LOS DEPARTAMENTOS DE LA BASE DE DATOS SIN REPETIRSE
        const departamentos = await db.collection('Personas').distinct(fieldname, query);   
        var aux_departamentos = [];
        // * SE RECORREN LOS DEPARTAMENTOS OBTENIDOS PARA VER CUANTAS VECES SE REPITE CADA UNO 
        for(var i = 0; i < departamentos.length; i++){
            const departamento = await db.collection('Personas').find({location: departamentos[i]}).toArray()
            var objeto_departamento = new Object()
            objeto_departamento.depart = departamentos[i]
            objeto_departamento.numero = departamento.length
            aux_departamentos.push(objeto_departamento)
        }
        
        for(var i = 0; i < 8; i++){
            var objeto_region = regiones[i]
            objeto_region.cantidad_region = 0
            objeto_region.departamentos = []
        }

        // * SE ASIGNAN LOS DEPARTAMENTOS A LAS DIFERENTES REGIONES
        for(var i = 0; i < aux_departamentos.length; i++){
            var objeto_departamento = aux_departamentos[i];
            if(objeto_departamento.depart == 'Quetzaltenango' || objeto_departamento.depart == 'Retalhuleu' || objeto_departamento.depart == 'San Marcos' || objeto_departamento.depart == 'Suchitepequez' || objeto_departamento.depart == 'Sololá' || objeto_departamento.depart == 'Totonicapán'){
                var auxregion = regiones[0]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Guatemala'){
                var auxregion = regiones[1]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Huehuetenango' || objeto_departamento.depart == 'Quiché'){
                var auxregion = regiones[2]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Chimaltenango' || objeto_departamento.depart == 'Sacatepequez'){
                var auxregion = regiones[3]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Alta Verapaz' || objeto_departamento.depart == 'Baja Verapaz'){
                var auxregion = regiones[4]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Chiquimula' || objeto_departamento.depart == 'El Progreso' || objeto_departamento.depart == 'Izabal' || objeto_departamento.depart == 'Zacapa'){
                var auxregion = regiones[5]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Jutiapa' || objeto_departamento.depart == 'Jalapa' || objeto_departamento.depart == 'Santa Rosa'){
                var auxregion = regiones[6]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }else if(objeto_departamento.depart == 'Petén'){
                var auxregion = regiones[7]
                auxregion.cantidad_region += objeto_departamento.numero
                auxregion.departamentos.push(objeto_departamento)
            }
        }
        var regionmasinfectados = {
            nombre_region : "",
            cantidad_region : 0,
            departamentos : []
        }
        for(let i = 0; i < 8; i++){
            if(regionmasinfectados.cantidad_region < regiones[i].cantidad_region){
                regionmasinfectados.nombre_region = regiones[i].nombre_region
                regionmasinfectados.cantidad_region = regiones[i].cantidad_region
                regionmasinfectados.departamentos = regiones[i].departamentos
            }
        }
        res.send(regionmasinfectados)
    }catch(err){
        res.status(500).json({'message' : 'failed'})
    }
})

// * METODO QUE DEVUELVE EL TOP 5 DE DEPARTAMENTOS MAS INFECTADOS
router.get('/top5departamentos', async (req, res) => {
    try{
        const fieldname = "location"
        const query = {}
        // * SE OBTIENEN TODOS LOS DEPARTAMENTOS DE LA BASE DE DATOS SIN REPETIRSE
        const departamentos = await db.collection('Personas').distinct(fieldname, query);   
        var aux_departamentos = [];
        for(var i = 0; i < departamentos.length; i++){
            const departamento = await db.collection('Personas').find({location: departamentos[i]}).toArray()
            var objeto_departamento = new Object()
            objeto_departamento.numero = departamento.length
            objeto_departamento.depart = departamentos[i]
            aux_departamentos.push(objeto_departamento)
        }

        for(let i = 0; i < aux_departamentos.length; i++){
            for(let j = 0; j < (aux_departamentos.length-1-i); j++){
                if(aux_departamentos[j].numero < aux_departamentos[j+1].numero){
                    const objeto = aux_departamentos[j]
                    aux_departamentos[j] = aux_departamentos[j+1]
                    aux_departamentos[j+1] = objeto
                }
            }
        }

        var resultado = []
        for(let i = 0; i < 5; i++){
            resultado.push(aux_departamentos[i])
        }
        res.send(resultado)
    }catch(err){
        res.status(500).json({'message' : 'failed'})
    }
})
module.exports = router