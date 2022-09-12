import chai from 'chai'
import chaiHttp from 'chai-http'
import { app } from '../../src/app'

chai.use(chaiHttp)
chai.should()

describe('Placeholder', () => {
  describe('GET /placeholder', () => {
    it('Should return 200', () => {
      chai
        .request(app)
        .get('/placeholder')
        .end((_, res) => {
          res.should.have.status(200)
        })
    })
  })

  describe('POST /placeholder', () => {
    it('Should return 201', () => {
      chai
        .request(app)
        .post('/placeholder')
        .end((_, res) => {
          res.should.have.status(201)
        })
    })
  })

  describe('PUT /placeholder', () => {
    it('Should return 201', () => {
      chai
        .request(app)
        .put('/placeholder')
        .end((_, res) => {
          res.should.have.status(201)
        })
    })
  })

  describe('DELETE /placeholder', () => {
    it('Should return 201', () => {
      chai
        .request(app)
        .delete('/placeholder')
        .end((_, res) => {
          res.should.have.status(201)
        })
    })
  })
})
