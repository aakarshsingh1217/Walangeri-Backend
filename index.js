const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json())
const mongoose = require('mongoose')
const url = process.env.MONGODB_URI
mongoose.connect(url)

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

const reportSchema = new mongoose.Schema({
    reportName: String,
    addressLot: String,
    jobType: String,
    urgencyLevel: String,
    notes: String
})

const Report = mongoose.model('Report', reportSchema)

let reports = [
    {
        id: "1",
        reportName: "Fault at Yarralin East",
        addressLot: "25",
        jobType: "Carpentry",
        urgencyLevel: "Medium",
        notes: "Looks easy"
    },
    {
        id: "2",
        reportName: "Fault at Yarralin West",
        addressLot: "54",
        jobType: "Electrician",
        urgencyLevel: "Low",
        notes: "I don't want to do this job!"
    },
    {
        id: "3",
        reportName: "Fault at Yarralin South",
        addressLot: "628",
        jobType: "Carpentry",
        urgencyLevel: "Medium",
        notes: "I hope I don't have to deal with anyone's... 'poop'..."
    },
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!<h1>')
})

app.get('/api/reports', (request, response) => {
    Report.find({}).then(reports => {
        response.json(reports)
    })
})

app.get('/api/reports/:id', (request, response) => {
    const id = request.params.id
    const report = reports.find(report => report.id === id)
    if (report) {
        response.json(report)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/reports/:id', (request, response) => {
    const id = request.params.id
    reports = reports.filter(report => report.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = reports.length > 0
      ? Math.max(...reports.map(r => Number(r.id)))
      : 0
    return String(maxId + 1)
}

app.post('/api/reports', (request, response) => {
    const body = request.body

    if (!body.reportName || !body.addressLot || !body.jobType || !body.urgencyLevel) {
        return response.status(400).json({
            error: 'Report name, address/lot, job type or urgency level missing'
        })
    }

    const report = {
        reportName: body.reportName,
        addressLot: body.addressLot,
        jobType: body.jobType,
        urgencyLevel: body.urgencyLevel,
        notes: body.notes || "",
        id: generateId(),
    }

    reports = reports.concat(report)

    response.json(report)
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)