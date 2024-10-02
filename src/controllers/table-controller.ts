import { knex } from "@/database/knex";
import { NextFunction, Request, Response } from "express"

class TableController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_number } = request.query

      const tables = await knex<TableRepository>('tables')
      .select()
      .whereLike('table_number', `%${table_number ?? ''}%`) 
      .orderBy('table_number')

      return response.json(tables);
    } catch (error) {
      // it will be treated by error handler
      next(error);
    }
  }
}

export { TableController }