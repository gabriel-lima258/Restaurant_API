import { Router } from "express";
import { productsRoutes } from "./products-routes";
import { tablesRoutes } from "./tables-route";
import { tablesSessionsRoutes } from "./tables-sessions-route";
import { ordersRoutes } from "./orders-route";


const routes = Router()
routes.use("/products", productsRoutes)
routes.use("/tables", tablesRoutes)
routes.use("/tables-sessions", tablesSessionsRoutes)
routes.use("/orders", ordersRoutes)

export { routes }