const jwt = require('jsonwebtoken')
const config = require('../config/app.json')

module.exports = {
    generate_token: function (data){
        var jwtSecretKey = config["JWT_SECRET_KEY"]
        const token = jwt.sign(
            data, 
            jwtSecretKey, 
            {
                expiresIn: config["JWT_TOKEN_EXPIRED"]
            }
        );
        return token;
    },
    verify_token: function (data){
        var jwtSecretKey = config["JWT_SECRET_KEY"];
        try {
            const token = data.token;
            const verified = jwt.verify(token, jwtSecretKey);
            console.log(verified)
            if(verified){
                return verified;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
};