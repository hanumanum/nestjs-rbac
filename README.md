# Role Based Access Control (RBAC) API with NestJS, MongoDB (Mongoose), and Passport

NESTJS-RBAC is a project starter boilerplate with basic authentication and authorization functionalities. It is built with NestJS, MongoDB (Mongoose), and Passport. It uses JWT tokens for authentication and authorization.

Each role has a set of permissions that allows or denies access to certain routes. The permissions are stored in the database and can be changed at runtime. 

### Additional functionality
1. First is the settings management functionality. Settings are stored in the database and can be changed at runtime.
2. Second is file uploader and management functionality. 

## Instalation
### Pre

```bash
# Install dependencies
git clone https://github.com/hanumanum/nestjs-rbac
cd nest-rbac
npm install
cp .env.example .env
# Configure .env file
npm run start:dev
# Happy hacking
```
### Configuration
If IS_FIRST_RUN is set to true, the app will create following 
1. First registered user will become an admin user with full privileges.
2. Minimal privileged user role

### Swagger
http://localhost:5050/#docs

#Development
Use JwtAuthGuard, RBACGuard to protect routes
```javascript
@UseGuards(JwtAuthGuard, RBACGuard)
```
You can set guards for the controller or for a specific route

# TODO 
- [ ] Forgot Password Route
- [ ] Get multiple settings with one request
- [ ] Write Tests
- [ ] ALL TODOS IN CODE


# Contributing and usage 
Any type of contribution is welcome. You can review code, write tests, give critique etc.
Fill comfortable to contribute, fork, star, share and use it in your projects.
This project is not production ready. It is a boilerplate for a project that needs authentication and authorization. Use it at your own risk. 
