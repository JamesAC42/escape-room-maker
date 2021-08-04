const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

import validateEmail from "../validateEmail";

import userQueries from "../queries/userQueries";
import acceptedDomains from "../acceptedDomains";

const register = (req: any, res: any, db: any, cache: any) => {
  const { username, email, dob, password, passwordConfirm } = req.body;

  console.log("Register attempt: " + username);

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("ip: " + ip);

  if (
    username === undefined ||
    email === undefined ||
    password === undefined ||
    passwordConfirm === undefined ||
    dob === undefined
  ) {
    res.send({
      success: false,
      error: "Invalid data provided",
    });
    return;
  }

  if (password !== passwordConfirm) {
    res.send({
      success: false,
      error: "Passwords do not match",
    });
    return;
  }
  if (!validateEmail(email)) {
    res.send({
      success: false,
      error: "Invalid email address",
    });
    return;
  }
  let domain = email.split("@")[1];
  if (acceptedDomains.indexOf(domain) === -1) {
    res.send({
      success: false,
      error: "Fishy email detected",
    });
    return;
  }
  if (username.length > 50) {
    res.send({
      success: false,
      error: "Username too long",
    });
    return;
  }
  let dobDate: Date;
  try {
    dobDate = new Date(dob);
    if (dobDate.toString() === "Invalid Date") {
      throw new Error("Invalid date.");
    }
  } catch (dobErr) {
    res.send({
      success: false,
      error: "Invalid date of birth",
    });
    return;
  }
  if (dobDate.getTime() > new Date().getTime()) {
    res.send({
      success: false,
      error: "Invalid date of birth",
    });
  }

  const findQuery = {
    name: "find-user-register",
    text: userQueries.findUser,
    values: [username],
  };

  const findEmailQuery = {
    name: "find-email-register",
    text: userQueries.findEmail,
    values: [email],
  };

  db.query(findQuery)
    .then((r: any) => {
      if (r.rows.length > 0) {
        res.send({
          success: false,
          error: "Account with that username already exists.",
        });
        return;
      }

      db.query(findEmailQuery)
        .then((r: any) => {
          if (r.rows.length > 0) {
            res.send({
              success: false,
              error: "Account with that email already exists.",
            });
            return;
          } else {
            bcrypt.genSalt(10, (err: any, salt: any) => {
              bcrypt.hash(password, salt, (err: any, hash: any) => {
                const uid = uuid();
                const creationDate = new Date();
                const rated: Array<any> = [];
                const settings: any = {};
                const played: Array<any> = [];
                const favorites: Array<any> = [];

                const insertQuery = {
                  name: "create-user",
                  text: userQueries.createUser,
                  values: [
                    uid,
                    username,
                    hash,
                    email,
                    creationDate,
                    dobDate,
                    false,
                    username,
                    false,
                    JSON.stringify(rated),
                    JSON.stringify(settings),
                    JSON.stringify(played),
                    JSON.stringify(favorites),
                  ],
                };

                db.query(insertQuery)
                  .then((r: any) => {
                    req.session.key = uid;
                    res.send({
                      success: true,
                      uid,
                      username,
                      email,
                      creation_date: creationDate,
                      dob: dobDate,
                      verified: false,
                      display_name: username,
                      admin: false,
                      rated,
                      settings,
                      played,
                      favorites,
                    });
                  })
                  .catch((err: any) => {
                    console.log(err);
                    res.send({
                      success: false,
                      error: "Error creating user",
                    });
                    return;
                  });
              });
            });
          }
        })
        .catch((err: any) => {
          console.log("FIND EMAIL");
          console.log(err);
          res.send({
            success: false,
            error: "Error processing input",
          });
          return;
        });
    })
    .catch((err: any) => {
      console.log("FIND USER");
      console.log(err);
      res.send({
        success: false,
        error: "Error processing input",
      });
      return;
    });
};

export default register;
