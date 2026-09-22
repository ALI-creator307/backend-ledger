const mongoose = require('mongoose')
const dns = require('dns')

function connectToDB() {
    try {
        dns.setServers(['8.8.8.8', '1.1.1.1'])
    } catch (e) {
        // Fallback to system DNS if setting custom servers fails
    }

    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to MongoDB successfully")
        })
        .catch(err => {
            console.error("Error connecting to DB:", err.message)
            process.exit(1)
        })
}

module.exports = connectToDB
