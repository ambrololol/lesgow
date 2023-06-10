const express = require('express');
const router = express.Router();
const validator = require('validator')
const model_user = require('../../models/model_user')
const bcrypt = require('bcrypt')
const passport = require('passport')
const mailer = require('../../module/mailer');
const encrypytor = require('../../module/encrypytor');
const email_content = require('../../config/email_content.json')
const store = require("store2");
const uuid = require('uuid')
const moment = require('moment')

router.get('/login', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }
    res.render('auth/login');
});

router.get('/register', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }
    res.render('auth/register');
});

router.get('/forgot_password', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }
    res.render('auth/forgot_password');
});

router.get('/change_password', async function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/auth/login')
        return
    }
    res.render('auth/change_password');
});

router.get('/logout', async function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/auth/login')
        return
    }
    req.logout(async function (err){
        res.redirect('/')
    });
});

router.post('/login', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }
    let body = req.body
    
    console.log(body)

    for(let keys in body){
        if(!body[keys]){
            return res.status(200).send({
                status:"FAILED",
                message:"Field tidak boleh kosong!"
            })
        }
    }

    //Cek ke db dan register
    let [res_db, err_db] = await model_user.get_user_by_email({
        email: body.username
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    
    if(res_db.length == 0){
        return res.status(200).send({
            status:"FAILED",
            message:"User belum terdaftar, silahkan registrasi terlebih dahulu"
        })
    }
    console.log(req.body)

    //Login dan buat session
    passport.authenticate('local', async function (err, user, info){
        console.log(err, user)
        if(err || !user){
            return res.status(200).send({
                status:"FAILED",
                message:"Username atau password salah"
            })
        }
        req.login(user, async function(err){
            if(err){
                return res.status(200).send({
                    code:200,
                    status:"FAILED",
                    message:"Username atau password salah"
                })
            }
            return res.status(200).send({
                status:"SUCCESS",
                message:"Login berhasil!"
            })
        })
    })(req, res, next)
});

router.post('/register', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }
    let body = req.body

    for(let keys in body){
        if(!body[keys] || !body["gender"]){
            return res.status(200).send({
                status:"FAILED",
                message:"Field tidak boleh kosong!"
            })
        }
    }
    
    if(!validator.isEmail(body.email)){
        return res.status(200).send({
            status:"FAILED",
            message:"Email tidak valid!"
        })
    }

    if(!validator.isMobilePhone(body.phone,'id-ID')){
        return res.status(200).send({
            status:"FAILED",
            message:"Nomor telepon tidak valid!"
        })
    }

    if(body.password.length < 6){
        return res.status(200).send({
            status:"FAILED",
            message:"Password minimal 6 karakter!"
        })
    }
    
    if(body.password != body.confirm_password){
        return res.status(200).send({
            status:"FAILED",
            message:"Password dan confirm password tidak sesuai!"
        })
    }

    //Cek ke db dan register
    let [res_db, err_db] = await model_user.get_user_by_email({
        email: body.email
    })
    if(err_db){
        console.log(err_db)
    }

    if(res_db.length > 0){
        return res.status(200).send({
            status:"FAILED",
            message:"Email telah terdaftar!"
        })
    }

    body.password = bcrypt.hashSync(body.password, 8);
    body.photo_path = 'default_photo.jpg'
    delete body.confirm_password

    //buat token untuk 5 menit dan send email
    let data = JSON.stringify(body)
    let uid = uuid.v4()
    let encrypted_data = encrypytor.encryption(data)
    let token_data = JSON.stringify({
        created_at: moment(),
        data: encrypted_data
    })
    store.set(uid,token_data)
    let url = req.protocol+"://"+req.headers.host+"/verif/"+uid
    let text_email = email_content.template_verifikasi_akun.replace('{{url}}',url)
    let to = body.email
    let subject = email_content.subject_verifikasi_akun
    let content = `<html><body><p>${text_email}</p><br><br><p>${email_content.template_no_reply}</p></body></html>`
    
    await mailer.sendMail(to, subject, content)

    return res.status(200).send({
        status:"SUCCESS",
        message:"Mohon untuk verifikasi akun ke email yang telah didaftarkan, link verifikasi berlaku selama 10 menit"
    })
});

router.post('/change_password', async function(req, res, next){
    if(!req.isAuthenticated()){
        res.redirect('/auth/login')
        return
    }
    let body = req.body

    for(let keys in body){
        if(!body[keys]){
            return res.status(200).send({
                status:"FAILED",
                message:"Field tidak boleh kosong!"
            })
        }
    }
    
    if(req.body.password != req.body.confirm_password){
        if(res_account.length == 0){
            return res.status(200).send({
                status:"FAILED",
                message:"Change password gagal! Password baru dan konfirmasi password harus sama!"
            })
        }
    
    }
    //Ganti password di db
    var [res_account, err_account] = await model_user.get_user_by_email({
        email: req.user.email
    })

    if(res_account.length == 0){
        return res.status(200).send({
            status:"FAILED",
            message:"Change password gagal! Akun tidak ditemukan"
        })
    }

    if(!bcrypt.compareSync(req.body.old_password,res_account[0].password)){
        return res.status(200).send({
            status:"FAILED",
            message:"Change password gagal! Password lama salah"
        })
    }

    var [res_change, err_change] = await model_user.update_password({
        email: req.user.email,
        password:bcrypt.hashSync(body.password, 8)
    })

    return res.status(200).send({
        status:"SUCCESS",
        message:"Change password berhasil!"
    })
});

router.post('/new_password', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }
    let body = req.body
    let token = req.body.token
    let resp = store.get(token)
    
    if(!resp){
        return res.status(200).send({
            status:"FAILED",
            message:"Token telah expired!"
        })
    }else{
        resp = JSON.parse(resp)
    }
    let duration = moment.duration(moment().diff(resp.created_at));

    if(duration.asSeconds() > 600){
        return res.status(200).send({
            status:"FAILED",
            message:"Token telah expired!"
        })
    }

    for(let keys in body){
        if(!body[keys]){
            return res.status(200).send({
                status:"FAILED",
                message:"Field tidak boleh kosong!"
            })
        }
    }

    if(body.password.length < 6){
        return res.status(200).send({
            status:"FAILED",
            message:"Password minimal 6 karakter!"
        })
    }
    
    if(body.password != body.confirm_password){
        return res.status(200).send({
            status:"FAILED",
            message:"Password dan confirm password tidak sesuai!"
        })
    }

    var [res_db, err_db] = await model_user.get_user_by_email({
        email: body.email
    })

    if(res_db.length == 0){
        return res.status(200).send({
            status:"FAILED",
            message:"User belum terdaftar, silahkan registrasi terlebih dahulu"
        })
    }
    
    let hash_password = bcrypt.hashSync(body.password, 8);
    var [res_update, err_update] = await model_user.update_password({
        email: body.email,
        password: hash_password
    })

    return res.status(200).send({
        status:"SUCCESS",
        message:"Change password berhasil!"
    })
});

router.post('/request_reset_password', async function(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
        return
    }

    let body = req.body

    for(let keys in body){
        if(!body[keys]){
            return res.status(200).send({
                status:"FAILED",
                message:"Field tidak boleh kosong!"
            })
        }
    }
    console.log(body)
    let [res_db, err_db] = await model_user.get_user_by_email({
        email: body.email
    })
    if(err_db){
        console.log(err_db)
    }
    if(res_db.length == 0){
        return res.status(200).send({
            status:"FAILED",
            message:"Email belum terdaftar!"
        })
    }

    //buat token untuk 5 menit dan send email
    let data = JSON.stringify({
        email:body.email
    })

    let encrypted_data = encrypytor.encryption(data)
    let token_data = JSON.stringify({
        created_at: moment(),
        data: encrypted_data
    })
    let uid = uuid.v4()
    store.set(uid,token_data)
    let url = req.protocol+"://"+req.headers.host+"/reset/"+uid
    let text_email = email_content.template_forgot_password.replace('{{url}}',url)
    let to = body.email
    let subject = email_content.subject_forgot_password
    let content = `<html><body><p>${text_email}</p><br><br><p>${email_content.template_no_reply}</p></body></html>`
    
    await mailer.sendMail(to, subject, content)
    
    return res.status(200).send({
        status:"SUCCESS",
        message:"Email untuk reset password akun telah dikirimkan, link reset password berlaku selama 10 menit"
    })
});



module.exports = router;