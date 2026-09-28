export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
export const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });
export const created = (res, data) => res.status(201).json({ success: true, data });
//# sourceMappingURL=handler.js.map