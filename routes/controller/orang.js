const express = require('express');
const router = express.Router();
const model_tr_kelas_member = require('../../models/model_tr_kelas_member');
const model_kelas = require('../../models/model_kelas');
const moment = require('moment')

router.get('/:kelas_code', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let user_id = req.user.user_id

    let [db_role, db_err_role] = await model_tr_kelas_member.get_role({
        kelas_code: kelas_code,
        user_id: user_id
    })

    console.log(db_role[0].role_user,"ROLE")
    var role = db_role[0].role_user
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    var [res_member, err_member] = await model_tr_kelas_member.get_member({
        kelas_code: kelas_code
    })
    console.log(res_member)
    if(err_member){
        console.log(err_member)
    }

    for (let i = 0; i < res_member.length; i++) {
        res_member[i].last_login = moment(res_member[i].last_login).format("dddd, DD MMM YYYY, HH:mm:ss");
        
    }
    
    var kelas = res_db[0]


    res.render('app/orang', {
        user: req.user,
        page: 'orang',
        kelas: kelas,
        arr_orang: res_member,
        role:role,
        currentPage: '/orang'
    });
});

router.post('/:kelas_code/remove/:user_id', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let user_id = req.params.user_id
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    var kelas_id = res_db[0].kelas_id

    var [res_db_delete, err_db_delete] = await model_tr_kelas_member.delete_member({
        kelas_id: kelas_id,
        user_id: user_id
    })

    var [res_member, err_member] = await model_tr_kelas_member.get_member({
        kelas_code: kelas_code
    })
    console.log(res_member)
    if(err_member){
        console.log(err_member)
    }

    var any_teacher = false

    for(let i = 0; i < res_member ;i++){
        if(res_member[i].role_user == 'guru'){
            any_teacher = true;
            break;
        }
    }

    if(!any_teacher){
        var [res_db_delete, err_db_delete] = await model_tr_kelas_member.edit_role({
            role_user: 'guru',
            kelas_id: kelas_id,
            user_id: res_member[0].user_id
        })
    }

    return res.status(200).send({
        status: "SUCCESS",
        message: "Berhasil remove member"
    })
});

router.post('/:kelas_code/edit/:user_id', async function(req, res, next){
    let kelas_code = req.params.kelas_code
    let user_id = req.params.user_id
    let role_member = req.body.role_member
    var [res_db, err_db] = await model_kelas.get_kelas_by_code({
        kelas_code: kelas_code
    })
    console.log(res_db)
    if(err_db){
        console.log(err_db)
    }
    var kelas_id = res_db[0].kelas_id

    var [res_db_delete, err_db_delete] = await model_tr_kelas_member.edit_role({
        kelas_id: kelas_id,
        user_id: user_id,
        role_user: role_member
    })

    return res.status(200).send({
        status: "SUCCESS",
        message: "Berhasil edit member"
    })
});

module.exports = router;