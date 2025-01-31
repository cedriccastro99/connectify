import mongoose from 'mongoose'

const passwordSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    password_hash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Password = mongoose.model('Password', passwordSchema)

export default Password
