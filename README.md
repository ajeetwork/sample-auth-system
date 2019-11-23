# sample-auth-system

sample express app to illustrate authentication system

## live

https://sample-auth-system.herokuapp.com

## Environment Variables

- PORT: port for app to listen on
- MONGO_URL: MongoDB url
- JWT_SECRET: JWT secret

## End points

- POST `/api/user`: create user
- POST `/api/user/auth`: login
- POST `/api/status`: create status for authenticated users

## development

```
sh run.dev.sh
```

## testing

```
npm test
```
