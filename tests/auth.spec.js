const Request = require('supertest')
const app = require('../index')

const Db = require('../database/query')
const helpers = require('../helperFunctions')
const { login } = require('../controllers/authController')
const { protectedGetUser } = require('../controllers/apiController')


jest.mock('../helperFunctions')
jest.mock('../database/query')


describe('Unit Testing', () => {
	it('Should generate token', async() => {

		const request = {
			body: {
				email: 'testEmail@gmail.com',
				password: 'testPassword',
			}
		}

		const response = {}

		//mock chaining
		response.json = jest.fn()
		response.cookie = jest.fn(() => response)
		response.status = jest.fn(() => response)


		Db.getUserByEmail.mockImplementationOnce(() => ({
			rows: [
					{
						id: "1",
						email: "testEmail@gmail.com",
						hashehdPassword: "testPassword"
					}
			]
		}))

		helpers.comparePassword.mockImplementationOnce((x) => (true))
		helpers.jwtSign.mockImplementationOnce((x) => ('jwt-token'))

		await login(request, response)

		expect(response.cookie).toHaveBeenCalledTimes(1);
		expect(response.status).toHaveBeenCalledWith(200);
	})


	it("Should ensure that user cant access data from organisations they don't  have access to", async() => {
		const request = {
			params: {
				id :'1'
			},
			cookies: {
				accessToken: 'access-token'
			}
		}

		const response = {}

		//mock chaining
		response.json = jest.fn()
		response.status = jest.fn(() => response)

		helpers.jwtVerify.mockImplementationOnce((x) => (true))

		Db.getUser.mockImplementationOnce(() => ({
			rows: []
		}))

		await protectedGetUser(request, response)
		expect(response.status).toHaveBeenCalledWith(404);

	})
})

describe("E2E test", () => {
	it('Should register a user POST "/auth/register"', async() => {
		const response = await Request(app).post('/auth/register')
	})
})
