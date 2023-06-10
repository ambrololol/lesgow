
const mysql = require('../module/mysql_module')

module.exports = {
    insert_user_and_group: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "INSERT INTO tr_kelas_member (user_id, kelas_id, role_user) VALUES (?, ?, ?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.user_id, data.kelas_id, data.role_user])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_by_user_and_group: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT kelas_member_id FROM tr_kelas_member WHERE user_id = ? AND kelas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.user_id, data.kelas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_member: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT mu.user_id,tkm.kelas_member_id,last_login,photo_path,role_user,username FROM tr_kelas_member tkm LEFT JOIN ms_kelas mk ON tkm.kelas_id = mk.kelas_id LEFT JOIN ms_user mu ON tkm.user_id = mu.user_id WHERE kelas_code = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_code])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_role: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT role_user FROM tr_kelas_member tkm LEFT JOIN ms_user mu ON tkm.user_id = mu.user_id LEFT JOIN ms_kelas mk ON tkm.kelas_id = mk.kelas_id WHERE kelas_code = ? AND mu.user_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_code, data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    delete_member: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "DELETE FROM tr_kelas_member WHERE kelas_id = ? AND user_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id, data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    edit_role: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "UPDATE tr_kelas_member SET role_user = ? WHERE kelas_id = ? AND user_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.role_user,data.kelas_id, data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
}