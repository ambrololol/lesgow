const mysql = require('../module/mysql_module')

module.exports = {
    insert_jadwal: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "INSERT INTO ms_jadwal (kelas_id, tanggal, class_type, description, class_location) VALUES (?, ?, ?, ?, ?)"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id, data.tanggal, data.class_type, data.description, data.class_location])
            await mysql.endPool()
            return [result, null]
        } catch{
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_jadwal: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_jadwal WHERE kelas_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    get_jadwal_by_id: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "SELECT * FROM ms_jadwal WHERE jadwal_id = ?"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.jadwal_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    delete_jadwal: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "DELETE FROM ms_jadwal WHERE kelas_id = ? AND jadwal_id = ?;"
            console.log(data)
            var [result, cache] = await mysql.executeAsync(sql, [data.kelas_id, data.jadwal_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    },
    update_jadwal: async function(data){
        try{
            await mysql.connectAsync()
            var sql = "UPDATE ms_jadwal SET tanggal = ?, class_type = ?, description = ?, class_location = ? WHERE kelas_id = ? AND jadwal_id = ?"
            var [result, cache] = await mysql.executeAsync(sql, [data.tanggal, data.class_type, data.description, data.class_location,data.kelas_id, data.jadwal_id])
            await mysql.endPool()
            return [result, null]
        } catch {
            console.log(error)
            await mysql.endPool()
            return [null, error]
        }
    }
}