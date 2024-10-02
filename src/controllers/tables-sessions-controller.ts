import { knex } from "@/database/knex";
import { AppError } from "@/utils/AppError";
import { NextFunction, Request, Response } from "express"
import z from "zod";

class TablesSessionsController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      const bodySchema = z.object({
        table_id: z.number(),
      })

      const { table_id } = bodySchema.parse(request.body)

      const session = await knex<TablesSessionsRepository>('tables_sessions')
      .where({ table_id })
      .orderBy('opened_at', 'desc')
      .first();

      // verify if table exists and not closed yet
      if (session && !session.closed_at) {
        throw new AppError('This table is already open!')
      }

      // opening a table
      await knex<TablesSessionsRepository>('tables_sessions')
      .insert({ 
        table_id,
        opened_at: knex.fn.now()
      })

      return response.status(201).json();
    } catch (error) {
      // it will be treated by error handler
      next(error);
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const sessions = await knex<TablesSessionsRepository>('tables_sessions')
      .orderBy('closed_at')
 
      return response.json(sessions);
    } catch (error) {
      // it will be treated by error handler
      next(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN(value), { message: "Id must be a number!"})
      .parse(request.params.id);

      const session = await knex<TablesSessionsRepository>('tables_sessions')
      .where({ id })
      .first()

      if (!session) {
        throw new AppError('Session table not found!')
      }
      
      if (session.closed_at) {
        throw new AppError('This session is already closed!')
      }

      await knex<TablesSessionsRepository>('tables_sessions')
      .update({ closed_at: knex.fn.now() })
      .where({ id })
 
      return response.json();
    } catch (error) {
      // it will be treated by error handler
      next(error);
    }
  }
}

export { TablesSessionsController }