const mysql = require('../module/mysql_module')

module.exports = {
    get_user_by_email: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "SELECT username, email, password, photo_path, mobile_number, address, gender FROM ms_user WHERE email = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.email])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_user_by_id: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "SELECT username, email, password, photo_path, mobile_number, address, gender FROM ms_user WHERE user_id = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_duplicate_email: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "SELECT username, email, password, photo_path, mobile_number, address, gender FROM ms_user WHERE email = ? AND user_id != ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.email,data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_all_data_user_by_email: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_user WHERE email = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.email])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    login_user: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "UPDATE `ms_user` SET `last_login`= NOW() WHERE email = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.email])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    update_password: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "UPDATE `ms_user` SET `password` = ? WHERE email = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.password,data.email])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    insert_user: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "INSERT INTO ms_user(username,email,password,photo_path,mobile_number,address,gender) VALUES (?,?,?,?,?,?,?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql,[data.fullname,data.email,data.password,data.photo_path,data.phone,data.address,data.gender])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    edit_profile: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "UPDATE ms_user SET username = ?, email = ?,mobile_number = ?, address = ?, gender = ? WHERE user_id = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.username,data.email,data.mobile_number,data.address,data.gender, data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    edit_photo_profile: async function (data) {
        try {
            await mysql.connectAsync()
            var sql = "UPDATE ms_user SET photo_path = ? WHERE user_id = ?"
            var [result, cache] = await mysql.executeAsync(sql,[data.photo_path, data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch (error) {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
}