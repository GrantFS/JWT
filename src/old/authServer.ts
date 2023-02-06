import express from "express"
import dotenv from "dotenv"
import jwt from "jsonwebtoken"
import LocalStorage from "./localStorage"
import { User } from "./interfaces"

dotenv.config()
const app = express()
const Storage = new LocalStorage()

const tokenExpiryTime = "15s"
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ?? ""
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? ""

app.use(express.json())

app.post("/token", (req, res) => {
  const refreshToken = req.body.token
  if (Storage.hasNoTokens()) return res.sendStatus(401)
  if (!Storage.hasToken(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    return res.json({ accessToken })
  })
})

app.get("/logout", (req, res) => {
  Storage.removeToken(req.body.token)
  res.sendStatus(204)
})

app.post("/login", (req, res) => {
  const username = req.body.username
  const user: User = {
    name: username,
  }

  const accessToken = generateAccessToken(user)
  const refreshToken = jwt.sign(user, REFRESH_TOKEN_SECRET)
  Storage.addRefreshToken(refreshToken)
  return res.json({ accessToken, refreshToken })
})

const generateAccessToken = (user: User) => {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: tokenExpiryTime })
}

app.listen(4000)
