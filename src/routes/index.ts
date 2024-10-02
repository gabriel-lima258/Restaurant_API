import { Router } from "express";
import { productsRoutes } from "./products-routes";
import { tablesRoutes } from "./tables-route";
import { tablesSessionsRoutes } from "./tables-sessions-route";


const routes = Router()
routes.use("/products", productsRoutes)
routes.use("/tables", tablesRoutes)
routes.use("/tables-sessions", tablesSessionsRoutes)

export { routes }