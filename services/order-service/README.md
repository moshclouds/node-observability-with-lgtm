# Order Service

The Order Service acts as the orchestrator of the e-commerce mock transaction flow. It receives user orders, initiates payments via the Payment Service, and reserves items via the Inventory Service.

## Ports and Connectivity
*   **Host Port:** `3001`
*   **Container Port:** `3000`

## API Endpoints

*   `POST /orders` - Place a new order.
    *   Body: `{"itemId": string, "quantity": number, "price": number}`
*   `GET /orders` - Fetch all orders in the repository.
*   `GET /orders/:id` - Fetch details for a specific order by ID.
*   `DELETE /orders/:id` - Remove an order record.

## Configuration (Environment Variables)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening port for the application | `3000` |
| `PAYMENT_SERVICE_URL` | Target endpoint of the payment gateway | `http://payment-service:3000` |
| `INVENTORY_SERVICE_URL` | Target endpoint of the inventory manager | `http://inventory-service:3000` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Central Tempo trace collector URL | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | Service identifier tag inside Tempo | `order-service` |

## Observability

*   **Tracing:** Auto-instrumented using `@opentelemetry/sdk-node` in `src/config/instrumentation.ts`. Sends traces via HTTP/OTLP to Tempo (port 4318).
*   **Logging:** Outputs structured JSON console logs via `nestjs-pino`. Includes active `trace_id` and `span_id` context injection automatically for trace-log correlation.

## Docker Commands
To build and run this service independently:
```bash
docker build -t order-service .
docker run -p 3001:3000 \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://<monitor-vpc-ip>:4318 \
  -e OTEL_SERVICE_NAME=order-service \
  order-service
```
