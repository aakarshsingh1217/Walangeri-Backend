const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://walangeri:${password}@walangeri.kggfl.mongodb.net/Walangeri?retryWrites=true&w=majority&appName=Walangeri`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const reportSchema = new mongoose.Schema({
    reportName: String,
    addressLot: String,
    jobType: String,
    urgencyLevel: String,
    notes: String
})

const Report = mongoose.model('Report', reportSchema)

/*const report = new Report({
    reportName: "Fault at Yarralin West",
    addressLot: "25",
    jobType: "Carpentry",
    urgencyLevel: "Medium",
    notes: "Lets add some notes!"
})

report.save().then(result => {
    console.log('report saved!')
    mongoose.connection.close()
})*/

Report.find({}).then(result => {
    result.forEach(report => {
        console.log(report)
    })

    mongoose.connection.close()
})