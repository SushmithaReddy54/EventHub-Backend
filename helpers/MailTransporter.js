import nodemailer from 'nodemailer';
import { constants } from '../constansts.js';

export const MailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: constants.EMAIL,
        pass: constants.PASSWORD
    }
});