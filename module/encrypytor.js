const crypto = require('crypto');
const cryptoAlgorithm = 'aes-128-cbc';
const key = 'abcdefghijklmnop';
const iv = '1234567890123456';


module.exports = {
    encryption: function(data){
        try{
            const dataCrypto = crypto.createCipheriv(cryptoAlgorithm, key, iv);
            let dataCipher = dataCrypto.update(data, 'utf8', 'hex');
            dataCipher += dataCrypto.final('hex');
            console.log(dataCipher);
            return dataCipher
        }catch(err){
            return null
        }
    },
    decrypted: function(dataCipher){
        try{
            const dataDecipher = crypto.createDecipheriv(cryptoAlgorithm, key, iv);
            let decryptedData = dataDecipher.update(dataCipher, 'hex', 'utf8');
            decryptedData += dataDecipher.final('utf8');
            console.log(decryptedData);
            return decryptedData;
        }catch(err){
            return null
        }
    },
    
}