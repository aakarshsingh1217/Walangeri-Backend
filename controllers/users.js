const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body
  
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      username,
      name,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('reports', {reportName: 1, 
                                       addressLot: 1, 
                                       jobType: 1,
                                       urgencyLevel: 1,
                                       notes: 1,
                                       id: 1})
    
    response.json(users)
})

module.exports = usersRouter