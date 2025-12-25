import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    archived: {
      type: Boolean,
      default: false   // 👈 новое поле
    }
  },
  { timestamps: true }
)

export default mongoose.model('Todo', todoSchema)
