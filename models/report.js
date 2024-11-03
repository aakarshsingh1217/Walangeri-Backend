const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    image: String,
    reportName: String,
    addressLot: String,
    jobType: String,
    urgencyLevel: String,
    notes: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

reportSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Report', reportSchema)