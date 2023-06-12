const express = require('express');
const router = express.Router();
const model_user = require('../../models/model_user')
const validator = require('validator')
const fs = require('fs')
const multer = require('multer')
const path = require('path')
const path_upload = path.join(__dirname, '../../public/image')
const uploadPhoto = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            
            if (!fs.existsSync(path_upload)) {
                fs.mkdirSync(path_upload, "0777")
            }
            if(file.fieldname == "edit_photo_profile")
                cb(null, path_upload)
        },
        filename: function(req, file, cb) {
            if(file.fieldname == "edit_photo_profile")
                cb(null, Date.now() + path.extname(file.originalname))
        }
    }),
}).fields([
    { name: 'edit_photo_profile', maxCount: 1 }
])

router.get('/', async function(req, res, next){
    res.render('app/profile', {
        user: req.user,
        page: 'profile',
        currentPage: '/profile'
    });
});

router.post('/edit', async function(req, res, next){
    console.log(req.body)

    let body = req.body

    for(let keys in body){
        if(!body[keys]){
            return res.status(200).send({
                status:"FAILED",
                message:"Field tidak boleh kosong!"
            })
        }
    }

    if(!validator.isEmail(body.inputEmail)){
        return res.status(200).send({
            status:"FAILED",
            message:"Email tidak valid!"
        })
    }

    if(!validator.isMobilePhone(body.inputMobile,'id-ID')){
        return res.status(200).send({
            status:"FAILED",
            message:"Nomor telepon tidak valid!"
        })
    }

    let [res_db_id, err_db_id] = await model_user.get_user_by_id({
        user_id: body.inputId
    })
    if(err_db_id){
        console.log(err_db_id)
    }

    if(res_db_id.length == 0){
        return res.status(200).send({
            status:"FAILED",
            message:"User tidak terdaftar"
        })
    }

    let [res_db, err_db] = await model_user.get_duplicate_email({
        email: body.inputEmail,
        user_id: body.inputId
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

    let [res_db_edit, err_db_edit] = await model_user.edit_profile({
        email: body.inputEmail,
        username: body.inputName,
        address: body.inputAddress,
        mobile_number: body.inputMobile,
        gender: body.inputGender,
        user_id: body.inputId
    })
    if(err_db_edit){
        console.log(err_db_edit)
    }

    req.user.email = body.inputEmail
    req.user.username = body.inputName
    req.user.address = body.inputAddress
    req.user.mobile_number = body.inputMobile
    req.user.gender = body.inputGender

    return res.status(200).send({
        status:"SUCCESS",
        message:"Edit profile berhasil"
    })
});

router.post('/edit_photo_profile', async function(req, res, next){
    uploadPhoto(req, res, async function(err) {
        console.log(req.files["edit_photo_profile"])
        console.log(req.body)
        console.log(req.files)
        var file_data = req.files["edit_photo_profile"][0]
        if(![".jpg",".jpeg",".png"].includes(path.extname(file_data.filename))){
            fs.unlinkSync(path_upload+"/"+file_data.filename)
            return res.status(200).send({
                status:"FAILED",
                message:"File type tidak sesuai (harus jpeg, png, jpg)"
            })
        }
        
        var user_id = req.user.user_id

        var [update_db, err_db] = await model_user.edit_photo_profile({
            user_id: user_id,
            photo_path: file_data.filename
        })
        if(err_db){
            console.log(err_db)
        }
        req.user.photo_path = file_data.filename

        return res.status(200).send({
            status:"SUCCESS",
            message:"Edit profile photo berhasil"
        })
    });

});

module.exports = router;