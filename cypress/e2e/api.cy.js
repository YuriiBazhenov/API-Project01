
import { postRequestBody, putRequestBody } from '../fixtures/user.json'

describe('CRUD Operations', () => {

    let studentID

    beforeEach(function () {


        cy.fixture('user').then((data) => {
            this.firstName = data.postRequestBody.firstName
            this.lastName = data.postRequestBody.lastName
            this.email = data.postRequestBody.email
            this.dob = data.postRequestBody.dob

            this.firstName1 = data.putRequestBody.firstName
            this.lastName1 = data.putRequestBody.lastName
            this.email1 = data.putRequestBody.email
            this.dob1 = data.putRequestBody.dob
        })
    })

    it('Create a new student using POST', function () {

        cy.request({
            method: 'POST',
            url: Cypress.env('baseUrl'),
            body: postRequestBody

        }).then((response) => {
            cy.log(JSON.stringify(response.body, null, 2))

            studentID = response.body.id

            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(5000)

        })
        cy.task('runQuery', 'SELECT * FROM student WHERE email = \'jasonS@gmail.com\'').then((rows) => {

            const data = rows[0]

            const expectedValues = [this.dob, this.email, this.firstName, this.lastName]

            expectedValues.forEach((value, index) => {
                expect(data[index + 1]).to.equal(value)
            })

        })
    })


    it('Retrieve a specific user-created', function () {
        cy.request({
            method: 'GET',
            url: `${Cypress.env("baseUrl")}/${studentID}`,
            body: postRequestBody
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(5000)
        })

        cy.task('runQuery', 'SELECT * FROM student WHERE email = \'jasonS@gmail.com\'').then((rows) => {

            const data = rows[0]

            const expectedValues = [this.dob, this.email, this.firstName, this.lastName]

            expectedValues.forEach((value, index) => {
                expect(data[index + 1]).to.equal(value)
            })

        })
    })

    it('Update an existing user', function () {
        cy.request({
            method: 'PUT',
            url: `${Cypress.env("baseUrl")}/${studentID}`,
            body: putRequestBody
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(5000)
        })

        cy.task('runQuery', 'SELECT * FROM student WHERE email = \'JackieC@gmail.net\'').then((rows) => {

            const data = rows[0]

            const expectedValues = [this.dob1, this.email1, this.firstName1, this.lastName1]

            expectedValues.forEach((value, index) => {
                expect(data[index + 1]).to.equal(value)
            })

        })
    })

    it('Retrieve a specific user created to confirm the update.', function () {
        cy.request({
            method: 'GET',
            url: `${Cypress.env("baseUrl")}/${studentID}`,
            body: putRequestBody
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(5000)
        })

        cy.task('runQuery', 'SELECT * FROM student WHERE email = \'JackieC@gmail.net\'').then((rows) => {

            const data = rows[0]

            const expectedValues = [this.dob1, this.email1, this.firstName1, this.lastName1]

            expectedValues.forEach((value, index) => {
                expect(data[index + 1]).to.equal(value)
            })

        })
    })

    it('Finally, delete the user that you created.', () => {

        cy.request({
            method: 'DELETE',
            url: `${Cypress.env("baseUrl")}/${studentID}`
        }).then((response) => {
            expect(response.status).to.equal(200)
            expect(response.duration).to.be.below(5000)
        })

        cy.task('runQuery', 'SELECT * FROM student WHERE email = \'JackieC@gmail.net\'').then((rows) => {
            expect(rows).to.have.length(0)
        })
    })
})





