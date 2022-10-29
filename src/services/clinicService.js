const db = require("../models")

let createClinic = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name ||
                !inputData.address ||
                !inputData.imageBase64 ||
                !inputData.descriptionHTML ||
                !inputData.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Clinic.create({
                    name: inputData.name,
                    address: inputData.address,
                    image: inputData.imageBase64,
                    descriptionHTML: inputData.descriptionHTML,
                    descriptionMarkdown: inputData.descriptionMarkdown
                })
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll();
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'OK',
                data
            })
        } catch (error) {
            reject(error);
        }
    })
}
let getDetailClinicById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter id'
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                    include: [
                        { model: db.Doctor_Infor, where: { clinicId: inputId }, as: 'clinicData', attributes: ['doctorId'] },
                    ],
                    raw: false,
                    nest: true
                });

                if (!data) {
                    data = {}
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                    data
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
}