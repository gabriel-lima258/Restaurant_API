import { knex } from '@/database/knex';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response} from 'express'
import z from 'zod';

class ProductController {
  async index(request: Request, response: Response, next: NextFunction) {
    try {
      const { name } = request.query

      const products = await knex<ProductRepository>('products')
      .select()
      .whereLike('name', `%${name ?? ''}%`)  // query and all products if not found
      .orderBy('name')

      return response.json(products);
    } catch (error) {
      // it will be treated by error handler
      next(error);
    }
  }

  async create(request: Request, response: Response, next: NextFunction) {
    try {
      // validate data with zod parameters
      const bodySchema = z.object({
        name: z.string().trim().min(3),
        price: z.number().gt(0, { message: 'Value must be greater than zero'})
      })

      const { name, price } = bodySchema.parse(request.body)

      // insert data into the database and type into knex
      await knex<ProductRepository>('products').insert({ name, price })

      return response.status(201).json()
    } catch (error) {
      next(error)
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN (value), {message: "id must be a number"})
      .parse(request.params.id)

      const bodySchema = z.object({
        name: z.string().trim().min(3),
        price: z.number().gt(0, { message: 'Value must be greater than zero'})
      })

      const { name, price } = bodySchema.parse(request.body)

      const product = await knex<ProductRepository>('products')
      .select()
      .where({ id })
      .first()
  
      // verify if exits before updating
      if (!product) {
        throw new AppError('Product not found!')
      }  

      await knex<ProductRepository>('products')
      .update({ name, price, updated_at: knex.fn.now() })
      .where({ id })

      return response.json()
    } catch (error) {
      next(error)
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const id = z
      .string()
      .transform((value) => Number(value))
      .refine((value) => !isNaN (value), {message: "id must be a number"})
      .parse(request.params.id)

      // verify if product exists
      const product = await knex<ProductRepository>('products')
      .select()
      .where({ id })
      .first()

      if (!product) {
        throw new AppError('Product not found!')
      }

      await knex<ProductRepository>('products').delete().where({ id })

      return response.json()

    } catch (error) {
      next(error)
    }
  }
}

export { ProductController }