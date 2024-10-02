import { TableController } from "@/controllers/table-controller";
import { Router } from "express";

const tablesRoutes = Router()
const tableController = new TableController()

tablesRoutes.get('/', tableController.index)

export { tablesRoutes }