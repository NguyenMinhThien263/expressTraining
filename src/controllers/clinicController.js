const clinicService = require("../services/clinicService");

let createClinic = async (req, res) => {
    try {
        let data = await clinicService.createClinic(req.body);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: `'error from server' ${error}`,
        })
    }
}
let getAllClinic = async (req, res) => {
    try {
        let data = await clinicService.getAllClinic();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server',
        })
    }
}
let getDetailClinicById = async (req, res) => {
    try {
        let data = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: `error from server ${error}`,
        })
    }
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById,
}