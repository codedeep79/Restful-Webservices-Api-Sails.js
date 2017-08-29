/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    first_name : { type: 'string' },

    last_name : { type: 'string' },

    email : { type: 'string' },

    password : { type: 'string' },

    posts: {
      collection: 'post',
      via: '_user'
    },

    toJSON: function() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    }
  },

  checkPassword(password, encryptPassword){
    var mPack = require("machinepack-passwords");

    return new Promise((resolve, reject) => {
      mPack.checkPassword({
        passwordAttempt: password,
        encryptedPassword: encryptPassword
      }).exec({
        error: err => reject(err),
        incorrect: () => resolve(false),
        success: () => resolve(true)
      });
    });
  }

};

