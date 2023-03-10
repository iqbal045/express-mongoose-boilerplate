# express-mongoose-boilerplate

This is a Node.js Express project built to provide a starting point for web application development. It includes support
for environment variables, JWT authentication, and MongoDB.

### Installation

1. Clone the repository
2. Run `npm install`
3. Create a .env file in the root of the project with the following environment variables:

```
APP_URL=<your app URL>
API_URL=<your API URL>
PORT=<port number>
JWT_SECRET=<your JWT secret>
MONGO_DB_URI=<your MongoDB URI>
GMAIL_ID=<your Gmail account ID>
GMAIL_PASSWORD=<your Gmail account password>
```

### Run the project

```
npm run dev (Development)
npm run prod (Production)
```

### API Routes

#### User

```
POST /api/v1/user/auth/register
POST /api/v1/user/auth/login
GET /api/v1/user/auth/verify
POST /api/v1/user/auth/verifyByOtp
POST /api/v1/user/auth/verify/resend
POST /api/v1/user/auth/forget/password
POST /api/v1/user/auth/reset/password

POST /api/v1/user/verify/otp
POST /api/v1/user/verify/password
PUT /api/v1/user/profile/update
PATCH /api/v1/user/email/update
PATCH /api/v1/user/change-password
```

#### Admin

```
POST /api/v1/admin/auth/login
GET /api/v1/admin/auth/register

GET /api/v1/admin/moderators
POST /api/v1/admin/moderators
GET /api/v1/admin/moderators/:id
PUT /api/v1/admin/moderators/:id
DELETE /api/v1/admin/moderators/:id
GET /api/v1/admin/moderators/change-status/:id
GET /api/v1/admin/moderators/get/count

GET /api/v1/admin/users
GET /api/v1/admin/users/:id
GET /api/v1/admin/users/get/count
