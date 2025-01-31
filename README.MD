# Release Notes - v1.0.0 (2025-01-31)

## 🌐 Deployed URL

🔗 **Live Application**: [https://connectify-one-sepia.vercel.app](https://connectify-one-sepia.vercel.app)

## 🧑 Default User (Administrator)
```plaintext
    Email: admin@email.com
    Password: admin
```


## 🎉 Features

- **Authentication & User Management**
  - Sign in and sign up functionality.
  - Forgot password feature.
  - Admin approval required for new sign-ups.
  - User activation and deactivation.
  - Full CRUD operations for user management.

- **Phonebook Management**
  - Add, edit, delete, and view contacts.
  - Contact details include:
    - First Name
    - Last Name
    - Contact Number
    - Email Address
    - Profile Photo
  - Contact sharing feature with permission control.
  - Synchronized contact details across shared users.

- **Tech Stack**
  - Frontend: React.js
  - Backend: Node.js with Express.js
  - Databases:
    - **MongoDB** for NoSQL data storage.
  - Cloud Storage
    - Cloudinary

- **API-Driven Architecture**
  - The frontend interacts with the backend via secure APIs.
  - Direct database access from the frontend is restricted. 

## 📦 Installation

1. Clone the repository:  
   ```bash
        git clone https://github.com/cedriccastro99/connectify.git
   ```
2. Install dependencies for both frontend and backend
    ```bash
        cd /client && npm install  
        cd /api && npm install
    ```
3. Set up environment variables in a `.env` follow the `.env-sample` file:
    ```bash
        API: 
        MONGO_URI=mongodb+srv://<username>:<db_password>@cluster0.gzhfv.mongodb.net/<myDatabase>?retryWrites=true&w=majority&appName=Cluster0
        PORT=5000
        JWT_SECRET=secret

        CLOUDINARY_CLOUD_NAME=
        CLOUDINARY_API_KEY=
        CLOUDINARY_API_SECRET=

        CLIENT:
        VITE_BASE_URL="http://localhost:5000"
    ```

4. Start the development servers:
   ```bash
        cd /client && npm run dev  
        cd /api && npm run dev
    ```