module.exports = (req, res, next) => {
    if (!req.headers || !req.headers.authorization)
    {
        return res.badRequest({err: 'No Authorization header found'});
    }

    let tokenParam = req.headers.authorization;

    const verifiedToken = JwtService.verify(tokenParam);

    User.findOne({
        id: verifiedToken.payload.user.id
    }).then(user => {
        if(!user) {
            return next({err: 'Invalid Credentials'});
        }
        // Yeu Cau Token De Load User, Co User Thi Moi Next(), Load User Len
        req.token = verifiedToken.payload.user;
        next();
    });
};

