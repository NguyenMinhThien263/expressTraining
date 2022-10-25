import db from '../models/index';
require('dotenv').config();

let postBookingAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email
                || !inputData.doctorId
                || !inputData.timeType
                || !inputData.date
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter'
                })
            } else {
                //upsert Patient
                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
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
module.exports = {
    postBookingAppointment: postBookingAppointment,
}