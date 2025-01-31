import Promise from 'bluebird';
import { v2 as cloudinary } from 'cloudinary'

import ErrorHandler from '../../utils/errorHandler.js'; 
import fieldValidator from '../../utils/fieldValidator.js';

import Contact from '../models/contact.js'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })

class ContactController {
  async create(req, res, next) {
    try {
      const required_fields = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'contact_number'
      ]
      const validate = fieldValidator(required_fields, req.body)

      if (!validate.success) {
        return ErrorHandler(
          { message: validate.message, status: 400 },
          req,
          res,
          next
        )
      }

      const {
        user_id,
        first_name,
        last_name,
        email,
        contact_number,
        is_private = true
      } = req.body

      const contact = new Contact({
        user_id,
        first_name,
        last_name,
        email,
        contact_number,
        is_private
      })

      const new_contact = await contact.save()

      res.status(200).send({
        data: new_contact,
        success: true,
        message: 'Contact created successfully'
      })
    } catch (error) {
      log.error(`Error: ${error.message}`)
      res.status(error.status || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        data: null
      })
    }
  }
  
  async copy(req, res, next) {
    try {
      const required_fields = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'contact_number'
      ]
      const validate = fieldValidator(required_fields, req.body)

      if (!validate.success) {
        return ErrorHandler(
          { message: validate.message, status: 400 },
          req,
          res,
          next
        )
      }

      const {
        _id,
        user_id,
        first_name,
        last_name,
        email,
        contact_number,
        is_private = true
      } = req.body

      let new_contact_profile_photo = ''
      let new_public_profile_photo_id = ''

      const { contact_profile_photo = '' } = await Contact.findById(_id)

      // if the contact has profile photo then upload new to the copy
      if (contact_profile_photo) {

        const uploadedImage = await cloudinary.uploader.upload(contact_profile_photo, {
          folder: 'phonebook-management-system',
        });

        new_contact_profile_photo = uploadedImage.secure_url
        new_public_profile_photo_id = uploadedImage.public_id
      }

      const contact = new Contact({
        user_id,
        first_name,
        last_name,
        email,
        contact_number,
        is_private,
        contact_profile_photo: new_contact_profile_photo,
        public_profile_photo_id: new_public_profile_photo_id
      })

      const new_contact = await contact.save()

      res.status(200).send({
        data: new_contact,
        success: true,
        message: 'Contact created successfully'
      })
    } catch (error) {
      log.error(`Error: ${error.message}`)
      res.status(error.status || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        data: null
      })
    }
  }

  async list(req, res) {
    const {
      start = 0,
      limit = 10,
      sort = 'asc',
      sort_by = 'last_name',
      search = '',
      filter = {}
    } = req.body

    try {
      //sanitize filter
      const _filter = Object.keys(filter).reduce((acc, key) => {
        if (filter[key] !== '') {
          acc[key] = filter[key]
        }
        return acc
      }, {})

      // Build the query dynamically
      const query = { ..._filter }

      if (search) {
        query.$or = [
          { email: { $regex: `.*${search}.*`, $options: 'i' } }, // Add other fields as needed
          { first_name: { $regex: `.*${search}.*`, $options: 'i' } },
          { last_name: { $regex: `.*${search}.*`, $options: 'i' } },
          { contact_number: { $regex: `.*${search}.*`, $options: 'i' } }
        ]
      }

      const [contacts, contacts_count] = await Promise.all([
        await Contact.find(query)
          .skip(start)
          .limit(limit)
          .sort({ [sort_by]: sort === 'asc' ? 1 : -1 })
          .exec(),
        await Contact.countDocuments()
      ])

      res.status(200).send({
        data: {
          data: contacts,
          count: contacts_count
        },
        success: true,
        message: 'Contacts retrieved successfully'
      })
    } catch (error) {
      log.error(`Error: ${error.message}`)
      res.status(error.status || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        data: null
      })
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params

      const contact = await Contact.findById(id)

      if (!contact) {
        return ErrorHandler(
          { message: 'Contact not found', status: 404 },
          req,
          res,
          next
        )
      }

      const new_contact = await Contact.findByIdAndUpdate(id, req.body, {
        new: true
      })

      res.status(200).send({
        data: new_contact,
        success: true,
        message: 'Contact updated successfully'
      })
    } catch (error) {
      log.error(`Error: ${error.message}`)
      res.status(error.status || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        data: null
      })
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const contact = await Contact.findById(id)

      if (!contact) {
        return ErrorHandler(
          { message: 'Contact not found', status: 404 },
          req,
          res,
          next
        )
      }

      const { public_profile_photo_id = '', _id } = contact

      await Contact.deleteOne({ _id });

      // If the contact has an existing photo, delete it from Cloudinary
      if (public_profile_photo_id) {
        await cloudinary.uploader.destroy(public_profile_photo_id)
      }

      res.status(200).send({
        success: true,
        message: 'Contact deleted successfully',
        data: null
      })
    } catch (error) {
      log.error(`Error: ${error.message}`)
      res.status(error.status || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        data: null
      })
    }
  }

  async upload(req, res, next) {
    try {
      if (!req.file) {
        return ErrorHandler(
          { message: 'No file uploaded', status: 400 },
          req,
          res,
          next
        )
      }

      const { id } = req.params

      const contact = await Contact.findById(id)

      if (!contact) {
        return ErrorHandler(
          { message: 'Contact not found', status: 404 },
          req,
          res,
          next
        )
      }

      const { public_profile_photo_id = '' } = contact

      // If the contact has an existing photo, delete it from Cloudinary
      if (public_profile_photo_id) {
        await cloudinary.uploader.destroy(public_profile_photo_id)
      }

      // Use cloudinary's uploader to upload the image
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'image', folder: 'phonebook-management-system' },
          async (error, result) => {
            if (error) {
              log.error(`Error: ${error.message}`)
              return ErrorHandler(
                { message: error.message, status: 500 },
                req,
                res,
                next
              )
            }

            const new_contact = await Contact.findByIdAndUpdate(
              id,
              {
                contact_profile_photo: result.secure_url,
                public_profile_photo_id: result.public_id
              },
              { new: true }
            )

            res.status(200).send({
              data: new_contact,
              success: true,
              message: 'Contact profile photo updated successfully'
            })
          }
        )
        .end(req.file.buffer)
    } catch (error) {
      log.error(`Error: ${error.message}`)
      res.status(error.status || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        data: null
      })
    }
  }
}

export default new ContactController();