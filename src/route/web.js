import express from 'express';
import homeController from '../controllers/homeController';
import userController from '../controllers/userController';
let router = express.Router();

let initWebRoutes = (app) => {
    // router.get('/', (req, res) => {
    //     res.send("heheheheh")
    // })
    router.get('/', homeController.getHomePage)
    router.get('/crud', homeController.getCRUD)
    router.post('/post-crud', homeController.postCRUD)
    router.get('/get-crud', homeController.displayCRUD)
    router.get('/edit-crud', homeController.getEditCRUD)
    router.post('/put-crud/:id', homeController.putCRUD)
    router.get('/del-crud', homeController.deleteCRUD)
    
    //Login API
    router.post('/api/login', userController.handleLogin)
    //User section
    //CRUD user
    router.get('/api/get-all-user', userController.handleGetAllUsers);
    router.post('/api/create-new-user', userController.handleCreateNewUser);
    router.put('/api/edit-user', userController.handleEditUser);
    router.delete('/api/delete-user', userController.handleDeleteUser);


    //AllCODES
    router.get('/allcode', userController.getAllCode);
    return app.use('/', router);
}

module.exports = initWebRoutes;