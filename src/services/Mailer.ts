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
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.E_PASS,
      }
    });
  
    const tokenAdd = await addVerifToken(user_id);
    
    if (tokenAdd){
      const token = await getTokenFromId(tokenAdd.insertedId.toString());

      // gestion du template html
      const html = readFileSync(join(__dirname, '../emails/verif_email.html'), 'utf-8');
      const template = compile(html);
      const variables = {
        link: process.env.BASE_URL.concat(`/users/verif-email/${token}`.toString())
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
      const sent = transporteur.sendMail(emailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return false;
        } else {
          return true;
        }
      })

      return sent;
    }else {
      return false
    }
  }
}


