# Inventory Service

The Inventory Service acts as a mock ledger for product catalog stock, processing product reservations and additions.

## Ports and Connectivity
*   **Host Port:** `3003`
*   **Container Port:** `3000`

## API Endpoints

*   `POST /inventory/reserve` - Lock and reserve items for a pending order.
    *   Body: `{"itemId": string, "quantity": number}`
*   `POST /inventory/add` - Increase stock level for a product.
    *   Body: `{"itemId": string, "quantity": number}`
*   `GET /inventory` - Retrieve catalog list with remaining stock details.
*   `GET /inventory/:itemId` - Fetch stock levels of a single item.

## Configuration (Environment Variables)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening port for the application | `3000` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Central Tempo trace collector URL | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | Service identifier tag inside Tempo | `inventory-service` |

## Observability

*   **Tracing:** Auto-instrumented using `@opentelemetry/sdk-node`. Integrates context propagation.
*   **Logging:** Outputs structured Pino JSON logs with injected parent trace details.

## Docker Commands
To build and run this service independently:
```bash
docker build -t inventory-service .
docker run -p 3003:3000 \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://<monitor-vpc-ip>:4318 \
  -e OTEL_SERVICE_NAME=inventory-service \
  inventory-service
```
