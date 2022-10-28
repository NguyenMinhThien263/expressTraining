import db from '../models/index';
let createSpecialty = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.name ||
                !inputData.imageBase64 ||
                !inputData.descriptionHTML ||
                !inputData.descriptionMarkdown
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                await db.Specialty.create({
                    name: inputData.name,
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
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
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
let getDetailSpecialtyById = (inputId, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter id'
                })
            } else {
                let data = {}
                if (location === 'ALL') {
                    data = await db.Specialty.findOne({
                        where: {
                            id: inputId,
                        },
                        attributes: ['descriptionHTML', 'descriptionMarkdown'],
                        include: [
                            { model: db.Doctor_Infor, as: 'specialtyData', attributes: ['doctorId', 'provinceId'] },
                        ],
                        raw: false,
                        nest: true
                    });
                } else {
                    data = await db.Specialty.findOne({
                        where: {
                            id: inputId,
                        },
                        attributes: ['descriptionHTML', 'descriptionMarkdown'],
                        include: [
                            { model: db.Doctor_Infor, where: { provinceId: location }, as: 'specialtyData', attributes: ['doctorId', 'provinceId'] },
                        ],
                        raw: false,
                        nest: true
                    });
                }
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
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById,
}