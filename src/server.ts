import dotenv from "dotenv"
import express, { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Post, User, UserRequest } from "./old/interfaces"

dotenv.config()
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ""

const app = express()

const posts: Post[] = [
  {
    username: "Dave",
    title: "Post 1",
  },
  {
    username: "Grant",
    title: "Post 2",
  },
]

app.use(express.json())

app.get("/posts", authMiddleware, (req: Request, res: Response) => {
  const request = req as UserRequest
  res.json(posts.filter((post) => post.username === request.user.name))
})

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

app.listen(3000)
