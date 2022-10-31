import db from '../models/index';
require('dotenv').config();
import emailService from '../services/emailService'
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}
let postBookingAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email
                || !inputData.doctorId
                || !inputData.timeType
                || !inputData.date
                || !inputData.fullName
                || !inputData.selectedGender
                || !inputData.address
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let token = uuidv4();
                await emailService.sendSimpleEmail({
                    reciverEmail: inputData.email,
                    patientName: inputData.fullName,
                    time: inputData.timeString,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    redirectLink: buildUrlEmail(inputData.doctorId, token),
                });
                //upsert Patient
                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        firstName: inputData.fullName,
                        gender: inputData.selectedGender,
                        address: inputData.address,
                        roleId: 'R3',
                    }
                });
                //Create a booking record
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            statusId: 'S1',
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
                            token: token
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Save Patient succeed',
                })
            }
        } catch (error) {
            reject(error);
        }
    })
}
let verifyBookingAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.token || !inputData.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        token: inputData.token,
                        statusid: 'S1'
                    },
                    raw: false,
                })
                if (appointment) {
                    await appointment.set({
                        statusId: 'S2',
                    });
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: 'Update Appointment succeed',
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Appointment has been activated or does not exist',
                    })
                }
            }
        } catch (error) {
            reject(error);
        }
    })
}
module.exports = {
    postBookingAppointment: postBookingAppointment,
    verifyBookingAppointment: verifyBookingAppointment,
}