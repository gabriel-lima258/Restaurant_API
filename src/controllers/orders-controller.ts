import { knex } from "@/database/knex"
import { AppError } from "@/utils/AppError"
import { NextFunction, Request, Response } from "express"
import z from "zod"

class OrdersController {
  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // validate data with zod parameters
      const bodySchema = z.object({
        table_session_id: z.number(),
        product_id: z.number(),
        quantity: z.number()
      })

      const { table_session_id, product_id, quantity } = bodySchema.parse(request.body)

      // verify if exist a session
      const session = await knex<TablesSessionsRepository>('tables_sessions')
      .where({ id: table_session_id })
      .first()

      if (!session) {
        throw new AppError('Session table not found')
      }

      if (session.closed_at) {
        throw new AppError('This table is closed')
      }

      const product = await knex<ProductRepository>('products')
      .where({ id: product_id })
      .first()

      if (!product) {
        throw new AppError('Product not found!')
      }

      // insert data into the database and type into knex
      await knex<OrderRepository>('orders').insert({
        table_session_id,  
        product_id, 
        quantity,
        price: product.price, // getting price from product
      })

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params

      const order = await knex('orders')
      .select(
        "orders.id",
        "orders.table_session_id", 
        "orders.product_id", 
        "products.name",
        "orders.price",
        "orders.quantity",
        knex.raw("(orders.price * orders.quantity) AS total"),
        "orders.created_at",
        "orders.updated_at"
      )
      .join("products", "products.id", "orders.product_id")
      .where({ table_session_id })
      .orderBy('orders.created_at', 'desc')

      return response.json(order);
    } catch (error) {
      // it will be treated by error handler
      next(error);
    }
  }

  async show(request: Request, response: Response, next: NextFunction) {
    try {
      const { table_session_id } = request.params

      // return the total and quantity of orders
      const order = await knex('orders')
      .select(
        // coalesce return 0 instead of null
        knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS total"),
        knex.raw("COALESCE(SUM(orders.quantity), 0) AS quantity"),
      )
      .where({ table_session_id })
      .first()

      return response.status(201).json(order)
    } catch (error) {
      next(error)
    }
  }
}

export { OrdersController }