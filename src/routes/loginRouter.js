import Router from "koa-router"
import authController from "../api/AuthController"

const router = new Router()

router.get("/getCaptcha", authController.getCaptcha)

export default router
