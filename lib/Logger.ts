import winston from "winston";
import { WinstonTransport as AxiomTransport } from "@axiomhq/axiom-node";

const Logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    // You can pass an option here, if you don't the transport is configured
    // using environment variables like `AXIOM_DATASET` and `AXIOM_TOKEN`
    process.env.NODE_ENV === "production"
      ? new AxiomTransport()
      : new winston.transports.Console({
          format: winston.format.simple(),
        }),
  ],
});

export default Logger;
