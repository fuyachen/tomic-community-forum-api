import combineRoutes from "koa-combine-routers"

import loginRouter from "./loginRouter"

export default combineRoutes(loginRouter)
