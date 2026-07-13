# Order Service

The Order Service acts as the orchestrator of the e-commerce mock transaction flow. It receives user orders, initiates payments via the Payment Service, and reserves items via the Inventory Service.

## API Endpoints

*   `POST /orders` - Place a new order.
    *   Body: `{"itemId": string, "quantity": number, "price": number}`
*   `GET /orders` - Fetch all orders in the repository.
*   `GET /orders/:id` - Fetch details for a specific order by ID.
*   `DELETE /orders/:id` - Remove an order record.

## Observability

*   **Tracing:** Auto-instrumented using `@opentelemetry/sdk-node` in `src/config/instrumentation.ts`. Sends traces via HTTP/OTLP to Tempo (port 4318).
*   **Logging:** Outputs structured JSON console logs via `nestjs-pino`. Includes active `trace_id` and `span_id` context injection automatically for trace-log correlation.
