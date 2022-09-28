import express from 'express';
import homeController from '../controllers/homeController';

let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/', (req, res) => {
    //     res.send("heheheheh")
    // })
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayCRUD)
    return app.use('/', router);
}

module.exports = initWebRoutes;