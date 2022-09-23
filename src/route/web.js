import express from 'express';
import homeController from '../controllers/homeController';
let router = express.Router();

let initWebRoutes=(app) =>{
    router.get('/', (req, res) => {
        res.send("heheheheh")
    })
    router.get('/home', homeController.getHomePage)
    return app.use('/', router);
}

module.exports= initWebRoutes;