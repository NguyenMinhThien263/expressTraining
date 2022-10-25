import patientService from '../services/patientService';
let postBookingAppointment = async (req, res) => {
    try {
        let data = await patientService.postBookingAppointment(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error from server',
        })
    }
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
}