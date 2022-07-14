const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Kindly enter your name'],
  },
  email: {
    type: String,
    required: [true, 'Kindly enter your email to signup or login'],
    unique: true,
    validate: [validator.isEmail, 'Kindly provide a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Kindly enter your user password'],
    minLength: 8,
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Kindly confirm your password'],
    validate: {
        validator: function(value) {
            return this.password === value
        },
        message: 'Passwords don\'t match'
    }
  },
  role: {
    type: String,
    enum: {
        values: ['tour-guide', 'user', 'lead-guide', 'admin'],
        message: '{VALUE} is not a supported role'
    },
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)
  this.confirmPassword = undefined

  next()
})


userSchema.methods.comparePasswords = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.checkChangedPasswords = function(jwtIssuedAt) {
  if(this.passwordChangedAt) {

    const chnagedTime = this.passwordChangedAt.getTime() / 1000
    return jwtIssuedAt < chnagedTime
  }

  return false
}

userSchema.methods.generateResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex')

  const token = crypto.createHash('sha256').update(resetToken).digest('hex')

  this.passwordResetToken = token
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)
module.exports = User