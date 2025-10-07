import { Request, Response, NextFunction } from 'express'
import { ZodObject, ZodError } from 'zod'

export const validateSchema = <T extends ZodObject<any>>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Log the incoming data for debugging
      console.log('Validation middleware - Request body:', JSON.stringify(req.body, null, 2));
      console.log('Validation middleware - Request files:', req.files);
      console.log('Validation middleware - Request query:', req.query);
      console.log('Validation middleware - Request params:', req.params);

      // Check if schema expects body, query, params structure or just body
      const schemaKeys = Object.keys((schema as any).shape || {});
      const hasBodyKey = schemaKeys.includes('body');
      const hasQueryKey = schemaKeys.includes('query');
      const hasParamsKey = schemaKeys.includes('params');

      if (hasBodyKey || hasQueryKey || hasParamsKey) {
        // Schema expects a structured object
        const validationData = {
          body: req.body,
          query: req.query,
          params: req.params,
          files: req.files
        };
        console.log('Validation middleware - Validating with structured data:', JSON.stringify(validationData, null, 2));
        await schema.parseAsync(validationData);
      } else {
        // Schema expects just the body directly
        console.log('Validation middleware - Validating body directly:', JSON.stringify(req.body, null, 2));
        await schema.parseAsync(req.body);
      }
      
      console.log('Validation middleware - Validation passed');
      return next()
    } catch (error) {
      console.error('Validation middleware - Validation error:', error);
      
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
          received: err.received
        }))

        console.error('Validation middleware - Detailed errors:', errorMessages);
        
        return res.status(400).json({
          message: 'Validation failed',
          errors: errorMessages
        })
      }
      
      console.error('Validation middleware - Non-Zod error:', error);
      return res.status(500).json({
        message: 'Internal server error during validation',
        error: (error as any).message
      })
    }
  }
} 