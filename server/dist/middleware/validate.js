import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";
export const validate = (schema, loc = "body") => (req, _res, next) => {
    try {
        const parsed = schema.parse(req[loc]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        req[loc] = parsed;
        next();
    }
    catch (err) {
        if (err instanceof ZodError) {
            const message = err.issues
                .map((i) => `${i.path.join(".")}: ${i.message}`)
                .join("; ");
            throw new ApiError(400, message);
        }
        throw err;
    }
};
//# sourceMappingURL=validate.js.map