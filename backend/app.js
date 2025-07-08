const express = require("express");
const config = require("./src/config");
const errorHandlingMiddleware = require("./src/middleware/error-handling.middleware");
const cors = require("cors");
const router = require("./src/routes");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  })
);

app.use("/api", router);

app.use(errorHandlingMiddleware);

const PORT = config.server.port || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
