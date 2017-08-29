var async = require("asyncawait/async");
var await = require("asyncawait/await");

module.exports = {
	
  login: function (req, res) {
      let email     = req.param("email"),
        password  = req.param("password");

    if (!email) {
      return res.badRequest({err: 'Invalid Email'});
    }

    if (!password) {
      return res.badRequest({err: 'Invalid Password'});
    }

    const loginReq = async() => {
      const user = await User.findOne({email});
      const isMatched = await User.checkPassword(password,user.password)

      if(!isMatched){
        throw new Error('Your password is not matched');
      }

      // Token ứng với từng username
      let resp = {user};
      let token = JwtService.issue({
          user,
          expiresIn: '1d'
      });

      resp.token = token;
      return resp;
    }

    loginReq()
      .then(user => res.ok(user))
      .catch(err => res.forbidden(err));
  },

  signup: function (req, res) {
    let firstName = req.param("first_name"),
        lastName  = req.param("last_name"),
        email     = req.param("email"),
        password  = req.param("password");

    if (!firstName) {
      return res.badRequest({err: 'Invalid First Name'});
    }

    if (!lastName) {
      return res.badRequest({err: 'Invalid Last Name'});
    }

    if (!email) {
      return res.badRequest({err: 'Invalid Email'});
    }

    if (!password) {
      return res.badRequest({err: 'Invalid Password'});
    }
    
    const signupRequest =  async() => {

      //add code into try catch
      try {

        //call the UtilService encryptpassword
         const encPassword = await UtilService.encryptPassword(password);
        // create User
        const user = await  User.create({
          first_name: firstName,
          last_name : lastName,
          email,
          password : encPassword
        });

        return res.ok(user);
      }
      catch (e){
        throw e;
      }

    };

    signupRequest()
      .then(user => res.ok(user))
      .catch(err => res.serverError(err));
    
  }
};

