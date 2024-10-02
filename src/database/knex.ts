import { knex as knexConfig } from 'knex'

// creating a config file with parameters from knexfile
import config from '../../knexfile'

export const knex = knexConfig(config)