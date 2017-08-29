const jwt = require("jsonwebtoken");
const secret = "secret123456";
"use strict"
module.exports = {
   issue: (payload, expiresIn) => {
       return jwt.sign({
            payload
       }, secret, { expiresIn: '1h' });
   },

   verify: (token) => {
        return jwt.verify(token, secret);
   }
}