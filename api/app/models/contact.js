import mongoose from 'mongoose'

const contactSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true
    },
    first_name: {
      type: String,
      required: true
    },
    last_name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    contact_number: {
      type: String,
      required: true
    },
    contact_profile_photo: {
      type: String,
      required: false
    },
    public_profile_photo_id: {
      type: String,
      required: false
    },
    is_private: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true
  }
)

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
