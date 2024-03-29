import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { asyncHandler } from '../utlis/asyncHandler.js'
import { ApiError } from '../utlis/ApiError.js'

//TODO: take refresh token from req.body/req.headers/req.cookie
//TODO: check if refresh token is recieved or not
//TODO: decode refresh token
//TODO: extract _id from decoded refresh token
//TODO: query database with _id to check refesh token matches
//TODO: if not matched give error
//TODO: if matched, regenerate access token and refresh token and send it in secured cookie

const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      throw new ApiError(401, 'Unauthorized request')
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken._id, {
      refreshToken: 0,
      password: 0,
    })

    if (!user) {
      throw new ApiError(401, 'Invalid access token')
    }

    req.user = user
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || 'Access token error')
  }
})

export { verifyJWT }
