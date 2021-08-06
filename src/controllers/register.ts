const bcrypt = require("bcrypt");
const { v4: uuid } = require("uuid");

import validateEmail from "../validateEmail";

import userQueries from "../queries/userQueries";
import acceptedDomains from "../acceptedDomains";

/*
  Handles the process of a user registering an account
 */
const register = (req: any, res: any, db: any, cache: any) => {
  const { username, email, dob, password, passwordConfirm } = req.body;

  // Diagnostic print
  console.log("Register attempt: " + username);
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  console.log("ip: " + ip);

  // Validate that all the proper information was sent
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

  // Validate that the password and the confirmation password
  // match.
  if (password !== passwordConfirm) {
    res.send({
      success: false,
      error: "Passwords do not match",
    });
    return;
  }

  // Validate that the email provided is a proper email
  if (!validateEmail(email)) {
    res.send({
      success: false,
      error: "Invalid email address",
    });
    return;
  }

  // Validate that the email provider is not a throwaway
  let domain = email.split("@")[1];
  if (acceptedDomains.indexOf(domain) === -1) {
    res.send({
      success: false,
      error: "Fishy email detected",
    });
    return;
  }

  // Make sure the username isn't too long
  if (username.length > 50) {
    res.send({
      success: false,
      error: "Username too long",
    });
    return;
  }

  // Validate the provided date of birth.
  // Make sure the date is actually a date as well
  // as make sure the date is not in the future
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

  // Construct the database query that will check if the
  // given username and email already exist
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

  // Execute the first query
  db.query(findQuery)
    .then((r: any) => {
      if (r.rows.length > 0) {
        res.send({
          success: false,
          error: "Account with that username already exists.",
        });
        return;
      }

      // Execute the second query
      db.query(findEmailQuery)
        .then((r: any) => {
          if (r.rows.length > 0) {
            res.send({
              success: false,
              error: "Account with that email already exists.",
            });
            return;
          } else {
            // Salt and hash the password to securely store in the database
            bcrypt.genSalt(10, (err: any, salt: any) => {
              bcrypt.hash(password, salt, (err: any, hash: any) => {
                // Generate all of the remaining data to be stored within the
                // new user.
                const uid = uuid();
                const creationDate = new Date();
                const rated: Array<any> = [];
                const settings: any = {};
                const played: Array<any> = [];
                const favorites: Array<any> = [];

                // Construct the database query that will insert the new user
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

                // Execute the query
                db.query(insertQuery)
                  .then((r: any) => {
                    // Log the user in and send the data back
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
                  .catch((err: Error) => {
                    console.error(err);
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
        .catch((err: Error) => {
          console.log("FIND EMAIL");
          console.error(err);
          res.send({
            success: false,
            error: "Error processing input",
          });
          return;
        });
    })
    .catch((err: Error) => {
      console.log("FIND USER");
      console.error(err);
      res.send({
        success: false,
        error: "Error processing input",
      });
      return;
    });
};

export default register;
