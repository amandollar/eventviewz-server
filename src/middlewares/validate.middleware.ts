import { Request, Response, NextFunction } from 'express'
import { ZodObject, ZodError } from 'zod'

export const validateSchema = <T extends ZodObject<any>>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if schema expects body, query, params structure or just body
      const schemaKeys = Object.keys(schema.shape || {});
      const hasBodyKey = schemaKeys.includes('body');
      
      if (hasBodyKey) {
        // Schema expects { body, query, params } structure
        await schema.parseAsync({
          body: req.body,
          query: req.query,
          params: req.params,
        })
      } else {
        // Schema expects just the body directly
        await schema.parseAsync(req.body)
      }
      
      return next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages
        })
      }
      
      return res.status(500).json({
        message: 'Internal server error during validation'
      })
    }
  }
} 