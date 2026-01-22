---
title: "Platform Architecture"
description: "Overview of the urBackend architecture and core components."
date: "2024-03-20"
---

# Architecture Overview

urBackend uses a geographically distributed architecture to ensure low-latency access to your data.

## Core Components

1. **Global Gateway**: Automatically routes requests to the nearest edge node.
2. **Data Layer**: Replicated PostgreSQL clusters with active-active configuration.
3. **Storage Engine**: S3-compatible object storage with global CDN.

### Connection Pooling

We utilize `PgBouncer` for efficient connection pooling. All managed databases come with pooling pre-configured.

> **Note**: For serverless environments like AWS Lambda or Vercel Edge Functions, always use the pooler URL (port 6543).

## Security Model

All data is encrypted at rest using AES-256. API requests require a valid JWT token signed by your project's secret key.

```typescript
// Example configuration
const config = {
  encryption: "AES-256",
  region: "us-east-1",
  replica: true
};
```
