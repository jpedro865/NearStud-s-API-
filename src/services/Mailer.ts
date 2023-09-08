import nodemailer from 'nodemailer';
import { addVerifToken, getTokenFromId } from './tokens.service';
import { readFileSync } from 'fs';
import { join } from 'path';
import { compile } from 'handlebars';

require('dotenv').config();


export class Mailer {
  async email_verif_send(user_id: string, user_email: string) {
    // setup du transporteur de mail
    const transporteur = nodemailer.createTransport({
      host: process.env.MAIL_SERVICE,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.E_PASS,
      }
    });
  
    const tokenAdded = await addVerifToken(user_id);
    if (tokenAdded.acknowledged){
      const token = await getTokenFromId(tokenAdded.token_id.toString());

      // gestion du template html
      const html = readFileSync(join(__dirname, '../emails/verif_email.html'), 'utf-8');
      const template = compile(html);
      const variables = {
        link: `${process.env.BASE_URL}/users/verif-email/${token}`
      }
      const compiledHtml = template(variables);
  
      // Options du mail
      const emailOptions = {
        from: process.env.EMAIL,
        to: user_email,
        subject: "Verification compte NearStud's",
        html: compiledHtml
      }

      // Envoi du mail
      const sent = await transporteur.sendMail(emailOptions)
        .then(() => {
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
      
      return {
        result: sent,
        message: sent ? "Email sent" : "Email not sent"
      }
    }else {
      return {
        result: false,
        message: "Token could not be created"
      }
    }
  }
}


