const request = require("supertest");
const { app }  = require("../../app");
const mongoose = require("mongoose");
const User = require("../../service/schemas/users");
const jwt = require('jsonwebtoken');

require("dotenv").config();

const { HOST_DB_TEST, SECRET } = process.env; 
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "test",
    email: "test@gmail.com",
    password: "test1234",
    token: jwt.sign({_id: userOneId}, SECRET)
}
describe("login", () => {
  beforeAll(async () => {
    await mongoose.connect(HOST_DB_TEST);
  });

  afterAll(async () => {
    await User.deleteMany();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
      await User.deleteMany();
      const user = new User(userOne)
      user.setPassword(userOne.password)
      await user.save();
  });

  it("should login existing user", async () => {
      const response = await request(app)
          .post('/api/users/login')
          .send({
              email: userOne.email,
              password: userOne.password
          })
          .expect(200)
      const user = await User.findById(userOneId); 
      expect(response.body.data.token).toBe(user.token);
      expect(response.body.data.user).toStrictEqual({
        email: expect.any(String),
        subscription: [expect.any(String)]
    });
  });
  it("should login nonexisting user", async () => {
      await request(app)
          .post('/api/users/login')
          .send({
              email: userOne.email,
              password: 'wrongpassword'
          })
          .expect(401)
  });


}); 