import express from "express";
import http from "http";
import { IdentityRoutes } from "./routes/identify";

const app = express();
const server = http.createServer(app);

app.use("/identify", IdentityRoutes);

app.use(/.*/, (_, res) => {
  res
    .status(405)
    .send(
      "Flux capacitor not found at this endpoint. Maybe you took a wrong turn in the space-time continuum?",
    );
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
