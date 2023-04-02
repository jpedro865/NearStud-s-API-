import nodemailer from 'nodemailer';
import { getUserById } from './users.services';
import { addVerifToken } from './tokens.service';

require('dotenv').config();

export async function email_verif_send(user_id: string) {
  const transporteur = nodemailer.createTransport({
    host: process.env.E_HOST,
    service: "",
    secure: false,
    auth: {
      user: process.env.MAIL,
      pass: process.env.E_PASS,
    }
  });

  const user: any = (await getUserById(user_id)).user;

  if(user) {
    await addVerifToken(user_id);
    await transporteur.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Verification compte NearStud's",
      html: '../emails/verif_email.html'
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    })
  }

  return false;
}
