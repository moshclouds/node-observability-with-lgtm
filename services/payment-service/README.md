# Payment Service

The Payment Service simulates an in-memory payment gateway, authorizing and auditing payments for customer orders.

## Ports and Connectivity
*   **Host Port:** `3002`
*   **Container Port:** `3000`

## API Endpoints

*   `POST /payments` - Process and authorize a new payment.
    *   Body: `{"orderId": string, "amount": number}`
*   `GET /payments` - Retrieve all processed payments audit log.
*   `GET /payments/:id` - Get details of a single transaction by ID.

## Configuration (Environment Variables)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening port for the application | `3000` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | Central Tempo trace collector URL | `http://localhost:4318` |
| `OTEL_SERVICE_NAME` | Service identifier tag inside Tempo | `payment-service` |

## Observability

*   **Tracing:** Instrumented with OpenTelemetry SDK node. Propagates trace contexts automatically from parent incoming HTTP calls.
*   **Logging:** Outputs JSON console logs utilizing `nestjs-pino`. Correlates incoming logs with the parent trace context automatically.

## Docker Commands
To build and run this service independently:
```bash
docker build -t payment-service .
docker run -p 3002:3000 \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=http://<monitor-vpc-ip>:4318 \
  -e OTEL_SERVICE_NAME=payment-service \
  payment-service
```
