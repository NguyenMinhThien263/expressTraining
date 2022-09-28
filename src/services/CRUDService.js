import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPasswords(data.password)
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender === 1 ? 'male' : 'female',
                roleId: data.roleId,
            })
            resolve('Create new User Successfully')
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
module.exports = {
    createNewUser: createNewUser,
}