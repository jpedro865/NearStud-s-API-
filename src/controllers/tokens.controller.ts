import e, { Request, Response } from "express";
import jsonwebtoken from "jsonwebtoken";
import { addRefreshToken, findByUserId, setUsedToken, verifyRefreshToken } from "../services/tokens.service";
import { getUserById, verifyUser } from "../services/users.services";
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

/**
 * Controller pour rafraichir le token
 * 
 * @param req 
 * @param res 
 */
export async function refresh_token(req: Request, res: Response) {
  // Vérification du token
  const token = req.cookies.refresh_token;
  if (token) {
    jsonwebtoken.verify(
      token,
      env_vars.KEY_TOKEN_REFRESH,
      async (err: any, data: any) => {
        if (err) {
          res
            .clearCookie('access_token')
            .clearCookie('refresh_token')
            .status(403).json({
              message: `Desole, une erreur est survenu: ${err}`,
            });
          return;
        } else if (await verifyRefreshToken(data._id, token)) {
          var user = null;
          if (await verifyUser(data._id)) {
            user = await getUserById(data._id);
          }
          if (user) {
            const access_token = jsonwebtoken.sign({
              "_id": user._id ?? "",
              "email": user.email ?? "",
              "firstname": user.firstname ?? "",
              "lastname": user.lastname ?? "",
              "username": user.username ?? "",
              "age": user.age ?? 0,
              "admin": user.admin ?? 0,
            }, env_vars.KEY_TOKEN, {
              expiresIn: 60*15, // 15 minutes
            });
            const refresh_token = jsonwebtoken.sign(
              {
                "_id": user._id,
              },
              env_vars.KEY_TOKEN_REFRESH,
              {
                expiresIn: 3600*24*90, // 90 days
              }
            );

            if (await addRefreshToken(user._id.toString(), refresh_token)) {
              res
                .cookie('access_token', access_token, {
                  httpOnly: true,
                  maxAge: 1000 * 60 * 15, // 15 minutes
                })
                .cookie('refresh_token', refresh_token, {
                  path: '/refresh',
                  httpOnly: true,
                  maxAge: 1000 * 60 * 60 * 24 * 90, // 90 days
                })
                .status(200).json({
                message: "Token rafraichit",
                });
              return;
            } else {
              res
                .clearCookie('access_token')
                .clearCookie('refresh_token')
                .status(403).json({
                  message: `Desole, une erreur est survenu : refresh token not created`,
                });
              return;
            }
          }
        } else {
          res
            .clearCookie('access_token')
            .clearCookie('refresh_token')
            .status(403).json({
              message: `Desole, une erreur est survenu : refresh token not valid`,
           });
          return;
        }
      }
    );
  } else {
    res
      .clearCookie('access_token')
      .clearCookie('refresh_token')
      .status(403).json({
        message: `Desole, une erreur est survenu : refresh token not found`,
      });
    return;
  }
}
