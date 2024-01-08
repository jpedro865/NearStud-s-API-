import { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { findByUserId, setUsedToken } from "../services/tokens.service";
import { verifyUser } from "../services/users.services";
import env_vars from "../utils/environment";
import { join } from "path";

/**
 * Valide le token d'un utilisateur utilise pour valider son email
 * 
 * @param req 
 * @param res 
 */
export async function valid_email_token(req: Request, res: Response) {
  // gestion du template html
  const erreur_page = join(__dirname, "../../public/html/validation_fail.html");
  const success_page = join(__dirname, "../../public/html/validation_success.html")

  // Vérification du token
  const token = req.params.token;
  jsonwebtoken.verify(
    token,
    env_vars.KEY_TOKEN,
    async (err: any, data: any) => {
      if (err) {
        res.status(403).sendFile(erreur_page);
      } else {
        const token = await findByUserId(data._id);

        if (token && !token.used) {
          await setUsedToken(token._id.toString());

          const verified = await verifyUser(token.user_id);

          if (verified) {
            res.status(200).sendFile(success_page);
          } else {
            res.status(403).sendFile(erreur_page);
          }
        } else {
          res.status(403).sendFile(erreur_page);
        }
      }
    }
  );
}
