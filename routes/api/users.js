const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../service/schemas/users');
const Joi = require('joi');
const auth = require('../../middleware/auth');
const { Conflict, Unauthorized } = require('http-errors');

require('dotenv').config()
const secret = process.env.SECRET

const registrationSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});
const loginSchema = Joi.object({
  password: Joi.string().min(6).required(),
  email: Joi.string().required(),
});

router.post('/registration', async (req, res, next) => {
  const { subscription, email, password } = req.body
  try {
    await registrationSchema.validateAsync(req.body);   
    const newUser = new User({ subscription, email })
    newUser.setPassword(password)
    await newUser.save()
    res.status(201).json({
        status: 'success',
        code: 201,
        data: {
          message: 'Registration successful',
          user: {
            email,
            subscription
          }
        },
      })
  } catch (error) {
    if (error.message.includes("duplicate key error collection")) {
      next(Conflict("User with this email already registered"));
    }
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body
  try { 
    await loginSchema.validateAsync(req.body);
    const user = await User.findOne({ email })
    if (!user || !user.validPassword(password)) {
        throw new Unauthorized("Incorrect login or password");
    }
    const payload = {
      id: user.id,
      email: user.email,
    }
    const token = jwt.sign(payload, secret, { expiresIn: '1h' })
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      status: 'success',
      code: 200,
      data: {
        token,
        user: {
          email,
          subscription: user.subscription
        }
      },
    })
  } catch (err) { 
    next(err)
  }

})

router.post('/logout', auth, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.user._id })
    user.token = '';
    await user.save()
    res.status(204).json({
      status: 'success',
      code: 204,
      data: {
        message: 'No Content'
      },
    })
   } catch (error) {
    next(error)
  }
})
router.get('/current', auth, async (req, res, next) => {
  try {
    const { user } = req;
     res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          user: user
        },
      })
   } catch (error) {
    next(error)
  }
})

router.patch('/', auth, async (req, res, next) => {
  try {
    const { subscription } = req.body;
    const { user } = req;
    const newUser = await User.findOne({ _id: user._id })
    newUser.subscription = subscription;
    await newUser.save()
     res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          user: {
            _id: newUser._id,
            subscription: newUser.subscription
          }
        },
      })
   } catch (error) {
    next(error)
  }
})
module.exports = router;
