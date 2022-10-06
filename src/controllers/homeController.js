import db from '../models/index';
import CRUDService from "../services/CRUDService";
let getHomePage = async (req, res) => {
    try {

        let data = await db.User.findAll();
        return res.render('homepage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (error) {
        console.log(error)
    }
}
let getCRUD = (req, res) => {
    return res.render('crud.ejs')
}
let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send("End about Create user")
}
let displayCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        dataTable: data
    })
}
let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render('editCRUD.ejs', {
            data: userData,
        });
    } else {
        return res.send(`Can not found User`);
    }

}
let putCRUD = async (req, res) => {
    // let userId = req.params.id;
    // console.log(userId);
    let data = req.body;
    let allUser = await CRUDService.updateUserData(data)
    return res.render('displayCRUD.ejs', {
        dataTable: allUser
    })
}
let deleteCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        let allUser = await CRUDService.deleteUserById(id);
        return res.render('displayCRUD.ejs', {
            dataTable: allUser
        })
    } else {
        return res.send('delete not successfully')
    }
}
module.exports = {
    getHomePage: getHomePage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    displayCRUD: displayCRUD,
    getEditCRUD: getEditCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}