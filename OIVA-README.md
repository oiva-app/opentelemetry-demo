## About this note
In addition to README.md and the standard Docs set, this file describes Oiva-specific customizations for observing the OTel Demo App with Honeycomb.

## Getting started
1. Clone the repo
2. `cd` into the project root (the one that contains `compose.yaml`)
3. Create `.env.secrets` and add your API key (see below)
4. `make start`

## make start-minimal?
The docs say that you can do `make start-minimal` but this has resulted in startup errors for me, so it's probably best avoided.

## Secrets
Create this file and add your secrets:
```bash
# .env.secrets

# Honeycomb ingest key
HONEYCOMB_API_KEY=hcaik_01krcjhcvkmt4q...
```
## Troubleshooting
Keep an eye on all services during startup.  You will see some logs errors and service restarts in the first minute or so, but things will stabilize after all services have started up.  

## Finer points

### Rebuilding
Check out the `Makefile`: it defines various ways of rebuild services:
- `make reploy service=frontend` will redeploy only the frontend.  Specify the service of your choice.
- `make build` rebuilds ALL images.  `make build && make start` will rebuild and start everything, in one go.  As this is a heavy operation, you should probably only do this if you are unsure of the state of your builds.

### OTel Collector Setup: Processor ordering
- "For the memory_limiter processor, the best practice is to add it as the first processor in a pipeline." [github](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/memorylimiterprocessor/README.md#best-practices)
- "The batch processor should be defined in the pipeline after the memory_limiter as well as any sampling processors. This is because batching should happen after any data drops such as sampling." [github](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md)