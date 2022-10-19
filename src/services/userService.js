import db from '../models/index';
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email);
            if (isExist) {
                //user already exists
                //compare password
                let user = await db.User.findOne({
                    where: { email: email },
                    attributes: ['email', 'firstName', 'lastName', 'password', 'roleId'],
                    raw: true,
                }
                );
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong Password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `User's isn't not found`;
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's mail isn't exist.Please try another one`;
            }
            resolve(userData);
        } catch (error) {
            reject(error);
        }
    })
}

let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = '';
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true
                })
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users);
        } catch (error) {
            reject(error);
        }
    })
}
let createNewUser = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exists
            let check = await checkUserEmail(inputData.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: 'Your email already exists,Try another email'
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPasswords(inputData.password)
                await db.User.create({
                    email: inputData.email,
                    password: hashPasswordFromBcrypt,
                    firstName: inputData.firstName,
                    lastName: inputData.lastName,
                    address: inputData.address,
                    phoneNumber: inputData.phoneNumber,
                    gender: inputData.gender,
                    roleId: inputData.roleId,
                    positionId: inputData.positionId,
                    image: inputData.avatar
                })
                resolve({
                    errCode: 0,
                    message: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let hashUserPasswords = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswords = await bcrypt.hashSync(password, salt);
            resolve(hashPasswords);
        } catch (error) {
            reject(error);
        }
    })
}
let deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: false
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: 'User not exist'
                })
            }
            await user.destroy();
            resolve({
                errCode: 0,
                errMessage: 'User is deleted'
            })
        } catch (error) {
            reject(error)
        }
    })
}
let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    message: "Missing Id Parameter"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if (user) {
                await user.set({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                });
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: "Update user successfully"
                })
            } else {
                resolve({
                    errCode: 1,
                    errMessage: 'User not found'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
//ALLCODES
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let res = {};
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
}