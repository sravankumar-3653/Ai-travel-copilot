const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
  const {name, email, mobile, password} = req.body

  try {
    const userExists = await User.findOne({email})

    if (userExists) {
      return res.status(400).json({
        message: 'User already exists',
      })
    }

    const salt = await bcrypt.genSalt(10)

    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
  name,
  email,
  mobile,
  password: hashedPassword,
})

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    res.status(201).json({
      token,
      user: {
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
},
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

const loginUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.findOne({email})

    if (
      user &&
      (await bcrypt.compare(password, user.password))
    ) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        }
      )

      res.json({
        token,
        user: {
  id: user._id,
  name: user.name,
  email: user.email,
  mobile: user.mobile,
},
      })
    } else {
      res.status(401).json({
        message: 'Invalid Credentials',
      })
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}
const changePassword = async (
  req,
  res
) => {
  try {
    const { oldPassword, newPassword } =
      req.body

    const user = await User.findById(
      req.user.id
    )

    const isMatch =
      await bcrypt.compare(
        oldPassword,
        user.password
      )

    if (!isMatch) {
      return res.status(400).json({
        message:
          'Current password is incorrect',
      })
    }

    const salt =
      await bcrypt.genSalt(10)

    user.password =
      await bcrypt.hash(
        newPassword,
        salt
      )

    await user.save()

    res.json({
      message:
        'Password updated successfully',
    })
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
}

module.exports = {
  registerUser,
  loginUser,
  changePassword,
}