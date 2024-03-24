import { ApiError } from '../utlis/ApiError.js'
import { asyncHandler } from '../utlis/asyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiResponse } from '../utlis/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  //TODO: get data from req
  const { username, email, password } = req.body

  //TODO: validate data(not empty)
  if (username === '' || email === '' || password === '') {
    throw new ApiError(400, 'All fields are required')
  }

  //TODO: check if user already exist
  const existedUser = await User.findOne({ $or: [{ username }, { email }] })

  if (existedUser) {
    throw new ApiError(409, 'User with email or username already exists')
  }

  //TODO: save to db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
  })

  //TODO: check if saved to db is successfull
  const createdUser = await User.findById(user._id, {
    password: 0,
    refreshToken: 0,
  })

  if (!createdUser) {
    throw new ApiError(500, 'An error occured while registering user')
  }

  //TODO: return res

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'))
})

export { registerUser }
