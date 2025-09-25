import mongoose from "mongoose";

let cached = global.mongoose;
// cari connection yg udh ada and disimpan di global.mongoose

if(!cached){
    cached = global.mongoose = {conn: null, promise: null};
    // kalo ga ada, bikin object cache baru, awalny null krna blm ad proses yg berjalan
}

async function dbConnect(){
    if(cached.conn){
        return cached.conn;
    }   
    if(!cached.promise){
        // kalau ga ada promise (null), belum ad proses koneksi
        const opts = {
            bufferCommands: false,
            // defaultnya mongoose simpen smua query saat koneksi blm berhasil, tpi kita mau query lgsg fail kalau koneksi ga berhasil
            // jadi di false spy bisa debugging 
        }
        cached.promise = mongoose.connect(`${process.env.MONGODB_URI}/quickcart`, opts).then(mongoose => {
            return mongoose;
        })
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;