import { User } from '../models/user.model.js'
import { ApiError } from '../utlis/ApiError.js'
import { ApiResponse } from '../utlis/ApiResponse.js'
import { asyncHandler } from '../utlis/asyncHandler.js'

const cookieOptions = {
  httpOnly: true,
  secure: true,
}

const generateTokens = async (userID) => {
  try {
    const user = await User.findById(userID)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    return { accessToken, refreshToken }
  } catch (error) {
    throw new ApiError(500, 'Something went wrong while generating tokens')
  }
}

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

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!(email || password)) {
    throw new ApiError(401, 'Email and password is required')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password)

  if (!isPasswordCorrect) {
    throw new ApiError(401, 'Incorrect password')
  }

  const { accessToken, refreshToken } = await generateTokens(user._id)

  const outUser = await User.findOne(
    { email },
    { password: 0, refreshToken: 0 }
  )

  return res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(new ApiResponse(200, outUser, 'User found and valid'))
})

const logoutUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  )

  return res
    .status(200)
    .clearCookie('accessToken', cookieOptions)
    .clearCookie('refreshToken', cookieOptions)
    .json(new ApiResponse(200, 'User logged out'))
})

export { loginUser, logoutUser, registerUser }
