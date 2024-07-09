const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

require('dotenv').config()


function hashPassword (password) {
	return new Promise((res, rej) => {
		bcrypt.hash(password, 10, (err, hash) => {
			if (err) {
				rej(err)
			} else {
				res(hash)
			}
		})
	})
}

async function comparePassword (password, hashedPassword) {
	const match = await bcrypt.compare(password, hashedPassword)
	return match;
}

async function jwtSign (info) {
	const jwtToken = await jwt.sign(info, process.env.SECRET)
	return jwtToken
}

async function jwtVerify (token) {
	const result = await jwt.verify(token, process.env.SECRET)
	return result;
}

function ValidateField (value, regex, field, message) {
	try {
		if (!value && field != 'phone') {
			return ({
				field,
				message: "Must not be empty"
			})
		}
		let exp = new RegExp(regex)

		if (!exp.test(value)) {
			return ({
				field,
				message
			})
		}
	} catch (err) {
		return 
	}
}


module.exports = {
	hashPassword,
	comparePassword,
	jwtSign,
	jwtVerify,
	ValidateField
}