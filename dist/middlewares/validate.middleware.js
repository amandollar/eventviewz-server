"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSchema = void 0;
const zod_1 = require("zod");
const validateSchema = (schema) => {
    return async (req, res, next) => {
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
                });
            }
            else {
                // Schema expects just the body directly
                await schema.parseAsync(req.body);
            }
            return next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: errorMessages
                });
            }
            return res.status(500).json({
                message: 'Internal server error during validation'
            });
        }
    };
};
exports.validateSchema = validateSchema;
//# sourceMappingURL=validate.middleware.js.map