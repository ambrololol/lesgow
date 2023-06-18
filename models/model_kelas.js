const mysql = require('../module/mysql_module')

module.exports = {
    insert_kelas: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "INSERT INTO ms_kelas(kelas_name,kelas_code,kelas_description,kelas_cover,kelas_photo) VALUES (?,?,?,?,?)" 
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql,[data.kelas_name,data.kelas_code,data.kelas_description,data.kelas_cover,data.kelas_photo])
            await mysql.endPool()
            return [result, null]
        } catch (error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_kelas: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_user"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [])
            await mysql.endPool()
            return [result, null]
        } catch (error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_kelas_by_user_id: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT mk.* FROM ms_kelas mk LEFT JOIN tr_kelas_member tkm ON mk.kelas_id = tkm.kelas_id WHERE tkm.user_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.user_id])
            await mysql.endPool()
            return [result, null]
        } catch (error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_kelas_by_code: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_kelas WHERE kelas_code = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql,[data.kelas_code])
            await mysql.endPool()
            return [result, null]
        } catch (error){
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    delete_kelas: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "DELETE FROM ms_kelas WHERE kelas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql,[data.kelas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    cari_kelas: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_kelas WHERE kelas_name LIKE ?";
            console.log(data);
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_name])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    edit_kelas: async function(data){
        try {
            await mysql.connectAsync()
            var sql = "UPDATE ms_kelas SET kelas_name = ?, kelas_description = ? WHERE kelas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_name, data.kelas_description, data.kelas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    }
}