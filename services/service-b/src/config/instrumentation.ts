import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

// The exporter will automatically read the target endpoint from the 
// OTEL_EXPORTER_OTLP_ENDPOINT environment variable passed via Docker Compose
const traceExporter = new OTLPTraceExporter();

export const sdk = new NodeSDK({
  traceExporter,
  instrumentations: [
    getNodeAutoInstrumentations({
      // We disable fs (filesystem) instrumentation as it generates a massive amount of noise
      '@opentelemetry/instrumentation-fs': { enabled: false },
    }),
  ],
});

// Start the SDK
sdk.start();

// Gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((err) => console.log('Error terminating tracing', err))
    .finally(() => process.exit(0));
});
