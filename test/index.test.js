const  User = require('../models/userModel')
const chai = require('chai')

const expect = chai.expect

describe('User Service Unit Tests', function () {
  describe('Save User functionality', function () {
    it('should successfully add a user if the number of users in the DB', async function () {});
    it('should throw an error if users details are not provided', async function () {});
  });
});


describe('User Service Unit Tests', function () {
  describe('Save User functionality', function () {
    it('should successfully add a user with a unique email address', async function () {
      const name = 'Teddy Molly';
      const email = 'tedm@yahoo.com';
      const password = 'test1234'
      const confirmPassword = 'test1234'

      const returnedUser = await User({
        name,
        email,
        password,
        confirmPassword
      });

      expect(returnedUser.name).to.equal(name);
      expect(returnedUser.email).to.equal(email);
      expect(returnedUser.password).to.equal(password);
      expect(returnedUser.confirmPassword).to.equal(confirmPassword);
     
    });
    it('should throw an error if the number of users with the same profileId is not zero', async function () {});
  });
});