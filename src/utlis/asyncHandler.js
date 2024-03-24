import { ApiError } from './ApiError.js'

export const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next)
  } catch (error) {
    console.log(error)
    return res.status(400).json(new ApiError(400, error.message))
  }
}
