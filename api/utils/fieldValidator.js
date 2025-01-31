import mongoose from "mongoose";

const fieldValidator = (required_fields = [], req_body) => {
    
    if(required_fields || required_fields.length > 0) {
        for (let field of required_fields) {

            if(field === 'user_id') {
                if (!mongoose.Types.ObjectId.isValid(req_body[field])) {
                    return {
                        success: false,
                        message: 'Please provide a valid user id'
                    };
                }
            }

            if(field === 'email') {
                if (!req_body[field] || !validateEmail(req_body[field])) {
                    return {
                        success: false,
                        message: 'Please provide a valid email address'
                    };
                }
            }

            if (!req_body[field]) {
                return {
                    success: false,
                    message: 'Please provide all required fields'
                };
            }
        }
    }

    return {
        success: true
    };
}

export const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

export default fieldValidator;