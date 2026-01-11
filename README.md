# JSON Replacement Service

A TypeScript-based HTTP endpoint that processes arbitrary JSON payloads to replace occurrences of "dog" with "cat". The service is designed with a configurable replacement limit and built to remain stable under heavy traffic.

## Architectural Decisions

### Performance and Scalability

I chose the **Fastify** framework over Express because of its superior overhead management and high-performance JSON parsing, which is critical for meeting "heavy traffic" requirements.

The core logic uses a depth-first recursive traversal within a dedicated `ReplacementService`. To optimize this, I implemented a global counter that allows the service to bypass Regex execution entirely once the replacement limit is reached.

* **Time Complexity**: O(n) — We scan every node once to ensure no occurrences are missed.
* **Space Complexity**: O(d + n) — The stack grows with the tree depth (d), and we allocate memory (n) for a new object to maintain immutability.

I also enforced a 1MB payload limit at the entry point as an initial safeguard against Large Payload DoS attacks. The service remains entirely stateless to facilitate easy horizontal scaling behind a load balancer.

### Type Safety and Design

I implemented a recursive `JsonValue` type to ensure the service handles complex, nested structures (objects, arrays, and primitives) with full type safety. Configuration is centralized in a dedicated module, allowing the replacement limit and server settings to be tuned via environment variables without code changes.

One key assumption I made is that replacements should be **case-sensitive**. This ensures data integrity by only replacing exact "dog" matches while leaving "DOG" or "Dog" untouched.

---

## Getting Started

### Prerequisites

* Node.js (v20+)
* npm
* Docker (Optional)

### Installation

```bash
npm install
```

### Environment Setup

> **Note**: A sample `.env` file is included in the repo for local testing.

Create a `.env` file in the root:

```env
PORT=3000
REPLACEMENT_LIMIT=10
BODY_LIMIT=1048576
NODE_ENV=development
```

### Running the App

```bash
# Dev mode with auto-reload
npm run dev

# Build and Start
npm run build
npm start
```

---

## Running with Docker (Optional)

This project includes a multi-stage Dockerfile to keep the production image lean.

1. **Build the image**:
```bash
docker build -t json-replacement-service .
```


2. **Run the container**:
```bash
docker run -p 3000:3000 \
  -e REPLACEMENT_LIMIT=5 \
  -e NODE_ENV=production \
  --name replacement-api \
  json-replacement-service
```
---

## Testing

I used **Jest** for the test suite, focusing on edge cases and structural integrity.

```bash
npm test
```

### Coverage Includes:

* **Boundary Logic**: Confirming the service stops exactly at `REPLACEMENT_LIMIT`.
* **Structural Integrity**: Ensuring deeply nested objects and arrays are returned intact.
* **Case Sensitivity**: Verifying that only exact matches trigger a replacement.
* **Global State**: Tracking the replacement count correctly across different branches of the JSON tree.

---

## Manual Testing

You can verify the `/replace` endpoint using the following:

**cURL**:

```bash
curl -X POST http://localhost:3000/replace \
     -H "Content-Type: application/json" \
     -d '{"message": "I love my dog", "meta": ["dog", "dog"]}'
```

**Postman**:

* Method: `POST`
* URL: `http://localhost:3000/replace`
* Body: `raw (JSON)`

---

## Production Roadmap

While the current implementation covers the core requirements, moving this to a high-traffic production environment would involve a few key upgrades:

### Performance & Scaling

The current recursive approach is fine for standard payloads, but for massive JSON trees, I would migrate to a streaming parser (like `JSONStream`) to keep memory usage constant and prevent OOM issues. I’d also add Fastify-native JSON schema validation (using `ajv`) to reject malformed data early and save CPU cycles.

### Monitoring & Observability

I’d swap out basic logging for a structured logger like `pino` to make logs easier to query in a stack like Datadog or ELK. Implementing OpenTelemetry would also be a priority to track P99 latencies and catch any event loop delays caused by the transformation logic.

### Resilience & Testing

To ensure the service actually "withstands heavy traffic," I’d set up automated load tests using `k6` or `autocannon`. This would help determine the right CPU/Memory limits for Kubernetes pods and define a baseline for horizontal scaling.

### Security

Beyond the basic body size limits already in place, I’d implement a rate-limiting layer and standard health-check endpoints (`/health/liveness`, `/health/readiness`) to ensure the service plays nice with a container orchestrator.

---
