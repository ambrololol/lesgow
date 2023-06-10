var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const model_user = require('../models/model_user');

var init = function () {
    passport.serializeUser(function (req, user, done) {
        done(null, user);
    });

    passport.deserializeUser(async function (req, user, done) {
        done(null, user);
    });

    passport.use('local',
        new LocalStrategy({
                passReqToCallback: true
            },
            async function (req, username, password, done) {
                console.log(req.body, username, password)
                var [res_db, err_db] = await model_user.get_all_data_user_by_email({
                    email: username
                })
                
                let user = res_db[0]
                let userData = user

                if(bcrypt.compareSync(password, res_db[0].password)) {
                    var [res_update, err_update] = await model_user.login_user({
                        email: username
                    })
                    
                    delete userData.password
                    return done(null, userData)
                } else {
                    return done(null, false);
                }
            }
        )
    )
    
    return passport
}

module.exports = init()