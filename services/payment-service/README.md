# Payment Service

The Payment Service simulates an in-memory payment gateway, authorizing and auditing payments for customer orders.

## API Endpoints

*   `POST /payments` - Process and authorize a new payment.
    *   Body: `{"orderId": string, "amount": number}`
*   `GET /payments` - Retrieve all processed payments audit log.
*   `GET /payments/:id` - Get details of a single transaction by ID.

## Observability

*   **Tracing:** Instrumented with OpenTelemetry SDK node. Propagates trace contexts automatically from parent incoming HTTP calls.
*   **Logging:** Outputs JSON console logs utilizing `nestjs-pino`. Correlates incoming logs with the parent trace context automatically.
