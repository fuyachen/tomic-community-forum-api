import koa from "koa"
import cors from "@koa/cors"
import koaBody from "koa-body"
import compose from "koa-compose"

import router from "./routes/routes"

const app = new koa()

const middleware = compose([cors(), koaBody()])

app.use(middleware)
app.use(router())

app.listen(3000)
