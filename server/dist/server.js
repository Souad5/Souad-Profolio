import app from "./app.js";
import { env } from "./config/env.js";
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled promise rejection:", reason);
});
app.listen(env.port, () => {
    console.log(`API server running on http://localhost:${env.port}`);
});
//# sourceMappingURL=server.js.map