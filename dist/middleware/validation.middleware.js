"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
// hermetic utility to validate body, params or query using a Zod schema
const validate = (schema) => {
    return (req, res, next) => {
        try {
            // attempt to parse the appropriate part of the request
            if (req.body && Object.keys(req.body).length > 0) {
                req.body = schema.parse(req.body); // body can be any
            }
            // Only validate params if they exist AND are expected by the schema
            // Don't validate params by default as they may contain route parameters like :id
            // that aren't defined in the schema
            if (req.query && Object.keys(req.query).length > 0) {
                req.query = schema.parse(req.query);
            }
            next();
        }
        catch (err) {
            if (err instanceof zod_1.ZodError) {
                return res.status(400).json({ message: "Datos inválidos", errors: err.issues });
            }
            next(err);
        }
    };
};
exports.validate = validate;
