import { ApiResponse } from '../utlis/ApiResponse.js'
import { ApiError } from '../utlis/ApiError.js'
import { asyncHandler } from '../utlis/asyncHandler.js'
import { Task } from '../models/task.model.js'

//TODO:

const getAllTasks = asyncHandler(async (req, res) => {
  const { _id } = req.user?._id

  if (!_id) {
    throw new ApiError(401, 'User id it not found')
  }

  const tasks = await Task.find({ user: _id })

  if (!tasks) {
    throw new ApiError(404, 'User not found')
  }
  return res.status(200).json(new ApiResponse(200, tasks, 'All tasks found'))
})

const createTask = asyncHandler(async (req, res) => {
  const { _id } = req.user
  const { title } = req.body

  if (!(_id && title)) {
    throw new ApiError(401, 'User id and task title not recieved')
  }

  const createdTask = await Task.create({
    title,
    user: _id,
  })

  if (!createdTask) {
    throw new ApiError(500, 'Error occured while creating the task')
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdTask, 'Task successfully created'))
})

const updateTask = asyncHandler(async (req, res) => {
  const { _id, data } = req.body

  if (!(_id && data)) {
    throw new ApiError(401, 'Task id and data(to be updated) not recieved')
  }

  const updatedTask = await Task.findByIdAndUpdate({ _id: _id }, data, {
    new: true,
  })

  if (!updatedTask) {
    throw new ApiError(500, 'Error occured while updating task')
  }

  return res.status(200).json(new ApiResponse(200, updatedTask, 'Task updated'))
})

const deleteTask = asyncHandler(async (req, res) => {
  const { _id: taskId } = req.body
  const { _id: userId } = req.user

  const deletedTask = await Task.deleteOne({ _id: taskId, user: userId })
  if (deletedTask.deletedCount === 0) {
    throw new ApiError(404, 'Task not found or not authorized to delete')
  }
  return res.status(200).json(new ApiResponse(200, deletedTask, 'Task deleted'))
})

export { getAllTasks, createTask, deleteTask, updateTask }
