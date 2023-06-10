const express = require('express');
const encrypytor = require('../../module/encrypytor');
const router = express.Router();
const model_user = require('../../models/model_user')
const moment = require('moment')
const store = require('store2')

router.get('/verif/:token', async function(req, res, next){
    if(!req.params.token){
        res.render('app/verif',{
            status:"FAILED",
            message:"URL tidak valid"
        })
        return
    }

    let token = req.params.token

    let resp = store.get(token)
    
    if(!resp){
        res.render('app/verif',{
            status:"FAILED",
            message:"URL tidak valid"
        })
        return
    }else{
        resp = JSON.parse(resp)
        store.remove(token)
    }
    let duration = moment.duration(moment().diff(resp.created_at));
    console.log("duration",duration)
    if(duration.asSeconds() > 600){
        res.render('app/verif',{
            status:"FAILED",
            message:"URL telah expired"
        })
        return
    }

    let string_json = encrypytor.decrypted(resp.data)

    let json_acc = JSON.parse(string_json)
    
    let [res_db, err_db] = await model_user.get_user_by_email({
        email: json_acc.email
    })
    if(err_db){
        console.log(err_db)
    }
    if(res_db.length > 0){
        res.render('app/verif',{
            status:"FAILED",
            message:"Akun telah terdaftar"
        });
        return
    }


    let [res_insert, err_insert] = await model_user.insert_user(json_acc)
    if(err_insert){
        console.log(err_insert)
    }

    res.render('app/verif',{
        status:"SUCCESS",
        message:"Verifikasi berhasil, akun berhasil dibuat"
    });
});

router.get('/reset/:token', async function(req, res, next){
    if(!req.params.token){
        res.render('app/verif',{
            status:"FAILED",
            message:"URL tidak valid"
        })
        return
    }
    
    let token = req.params.token
    
    let resp = store.get(token)
    
    if(!resp){
        console.log("MASUK")
        res.render('app/verif',{
            status:"FAILED",
            message:"URL tidak valid"
        })
        return
    }else{
        resp = JSON.parse(resp)
    }
    let duration = moment.duration(moment().diff(resp.created_at));
    console.log("duration",duration.asSeconds())
    if(duration.asSeconds() > 600){
        res.render('auth/input_password_reset',{
            status:"FAILED",
            message:"URL telah expired"
        })
        return
    }

    let string_json = encrypytor.decrypted(resp.data)

    let json_acc = JSON.parse(string_json)

    res.render('auth/input_password_reset',{
        email: json_acc.email,
        token: token
    });
    return
});

module.exports = router;