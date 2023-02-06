# JWT

Small application to demonstrate JWT

## Installation

```bash

    npm i
    npm run db:install

```

> Remember to create an .env file with tokens (See below to create a token)

## Usage

```bash

    npm run start

```

## Endpoints

The serverless application endpoints are all POST requests

> All requests need a header
```json
    "Content-Type": "application/json"
```

## Auth

```url

    http://localhost:4000/jwt/login

```

```json

body: {
    "username": ""
}

```


## Refresh Token

```url

    http://localhost:4000/jwt/token

```

```json

body: {
    "token": "INSERT_REFRESH_TOKEN"
}

```

## Logout

```url

    http://localhost:4000/jwt/logout

```

```json

body: {
    "token": "INSERT_REFRESH_TOKEN"
}

```

## Authenticated Routes

These will need to pass in an Authorization Header of the current token

### Example of Middleware

```ts

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const request = req as UserRequest
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)

    const authenticatedUser = user as User
    request.user = authenticatedUser
    next()
  })
}

```

## Generate a key

> node

```js

require('crypto').randomBytes(64).toString('hex')

```
