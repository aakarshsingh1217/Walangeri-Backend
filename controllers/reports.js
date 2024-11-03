const reportsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Report = require('../models/report')
const User = require('../models/user')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
}

reportsRouter.get('/', async (request, response) => {
    const reports = await Report
        .find({}).populate('user', {username: 1, name: 1})

    response.json(reports)
})

reportsRouter.get('/:id', (request, response, next) => {
    Report.findById(request.params.id)
        .then(report => {
            if (report) {
                response.json(report)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

reportsRouter.post('/', async (request, response, next) => {
    const body = request.body
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if(!decodedToken.id) {
        return response.status(401).json({ error: 'token invalid' })
    }
    const user = await User.findById(decodedToken.id)

    if (body.reportName === undefined || body.addressLot === undefined 
       || body.jobType === undefined || body.urgencyLevel === undefined) {
            return response.status(400).json({
                error: 'Report name, address/lot, job type or urgency level missing'
            })
    }

    const report = new Report({
        image: body.image,
        reportName: body.reportName,
        addressLot: body.addressLot,
        jobType: body.jobType,
        urgencyLevel: body.urgencyLevel,
        notes: body.notes || "",
        user: user.id
    })

    const savedReport = await report.save()
    user.reports = user.reports.concat(savedReport._id)
    await user.save()

    response.status(201).json(savedReport)
})

reportsRouter.delete('/:id', (request, response, next) => {
    Report.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

reportsRouter.put('/:id', (request, response, next) => {
    const body = request.body

    const report = {
        image: body.image,
        reportName: body.reportName,
        addressLot: body.addressLot,
        jobType: body.jobType,
        urgencyLevel: body.urgencyLevel,
        notes: body.notes || ""
    }

    Report.findByIdAndUpdate(request.params.id, report, { new: true })
        .then(updatedReport => {
            response.json(updatedReport)
        })
        .catch(error => next(error))
})

module.exports = reportsRouter