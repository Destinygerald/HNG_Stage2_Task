const express = require('express')
const { login, register } = require('../controllers/authController.js')

const Route = express.Router()

// login route
// POST - /auth/login
Route.post('/login', login)

// register route
// POST - /auth/register
Route.post('/register', register)

module.exports = Route