
import { z } from 'zod';

const UNIX_TIMESTAMP_MIN = 946684800; // 2000-01-01
const UNIX_TIMESTAMP_MAX = 4102444800; // 2100-01-01

const timestampSchema = z.coerce.number().int().min(UNIX_TIMESTAMP_MIN).max(UNIX_TIMESTAMP_MAX);

export const zq = {
  string: () => z.string().optional(),

  number: () => z.string().transform(Number).optional(),

  boolean: () =>
    z
      .enum(['true', 'false'])
      .transform((v) => v === 'true')
      .optional(),

  stringArray: () =>
    z
      .string()
      .transform((v) => (v ? v.split(',') : []))
      .optional(),

  numberArray: () =>
    z
      .string()
      .transform((v) => (v ? v.split(',').map(Number) : []))
      .optional(),
  timestamp: () => timestampSchema.optional(),
  timestampRange: () =>
    z
      .string()
      .transform((value) => {
        if (!value) {
          return undefined;
        }

        const parts = value.split(',');

        if (parts.length !== 2) {
          return undefined;
        }

        return parts;
      })
      .pipe(
        z.tuple([timestampSchema, timestampSchema]).refine(([from, to]) => from <= to, {
          message: 'range start must be less than or equal to range end'
        })
      )
      .optional()
};
