# Inventory Service

The Inventory Service acts as a mock ledger for product catalog stock, processing product reservations and additions.

## API Endpoints

*   `POST /inventory/reserve` - Lock and reserve items for a pending order.
    *   Body: `{"itemId": string, "quantity": number}`
*   `POST /inventory/add` - Increase stock level for a product.
    *   Body: `{"itemId": string, "quantity": number}`
*   `GET /inventory` - Retrieve catalog list with remaining stock details.
*   `GET /inventory/:itemId` - Fetch stock levels of a single item.

## Observability

*   **Tracing:** Auto-instrumented using `@opentelemetry/sdk-node`. Integrates context propagation.
*   **Logging:** Outputs structured Pino JSON logs with injected parent trace details.
