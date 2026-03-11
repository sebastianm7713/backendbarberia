import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// hermetic utility to validate body, params or query using a Zod schema
export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // attempt to parse the appropriate part of the request
      if (req.body && Object.keys(req.body).length > 0) {
        req.body = schema.parse(req.body); // body can be any
      }
      if (req.params && Object.keys(req.params).length > 0) {
        // casting to any resolves ParsedQs mismatch
        req.params = schema.parse(req.params) as any;
      }
      if (req.query && Object.keys(req.query).length > 0) {
        req.query = schema.parse(req.query as any) as any;
      }
      next();
    } catch (err: any) {
      if (err instanceof ZodError) {
        return res.status(400).json({ message: "Datos inválidos", errors: err.issues });
      }
      next(err);
    }
  };
};
