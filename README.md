## About this note
This file describes Oiva-specific customizations for running experiments and doing Evals on Oiva or any other AI agent intended to do .  

It should be considered a supplement to the [upstream README.md](https://github.com/open-telemetry/opentelemetry-demo) and [the official Demo Docs](https://opentelemetry.io/docs/demo/).  If you haven't done so already, you should start by reading the upstream README and docs.

## Getting started
1. Clone the repo
2. `cd` into the project root (the one that contains `compose.yaml`)
3. Create `.env.secrets` and add your API key (see below)
4. `make start`

### make start-minimal?
The docs say that you can do `make start-minimal` but this method results in startup errors and should be not used.

### Secrets
Create this file and add your secrets:
```bash
# .env.secrets

# Honeycomb ingest key
HC_INGEST_KEY=hcaik_01krcjhcvkmt4q...
```

## Troubleshooting
- Keep an eye on all services during startup.  You will see some logs errors and service restarts in the first minute or so, but things should stabilize after all services have started up.  
- Using VSCode or another IDE?  Beware that some plugins may inject environment variables and interfere with local deployment.  The simplest fix is to run `make start` with a non-IDE terminal.  You can also use `env` to inspect your environment for pollution.

## Finer points

### Rebuilding
Check out the `Makefile`: it defines various ways of rebuild services:
- `make reploy service=frontend` will redeploy only the frontend.  Specify the service of your choice.
- `make build` rebuilds ALL images.  `make build && make start` will rebuild and start everything, in one go.  As this is a heavy operation, you should probably only do this if you are unsure of the state of your builds.

### OTel Collector Setup: Processor ordering
- "For the memory_limiter processor, the best practice is to add it as the first processor in a pipeline." [github](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/memorylimiterprocessor/README.md#best-practices)
- "The batch processor should be defined in the pipeline after the memory_limiter as well as any sampling processors. This is because batching should happen after any data drops such as sampling." [github](https://github.com/open-telemetry/opentelemetry-collector/blob/main/processor/batchprocessor/README.md)