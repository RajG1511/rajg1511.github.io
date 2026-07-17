---
title: Market Sentinel
summary: A market-monitoring REST API that ingests macroeconomic data from multiple providers and stays consistent even when those providers throttle it.
dates: Dec 2025 – present
stack: [Java, Spring Boot, PostgreSQL, Redis, Docker, REST APIs]
repo: https://github.com/RajG1511/SpringMarketSentinel
featured: true
order: 1
---

## What it is

A Java/Spring Boot REST API that monitors macroeconomic data across multiple providers.
Provider APIs rate-limit, go down, and occasionally return the same data twice — the
whole point of this system is to keep serving correct numbers anyway.

## How it works

- A data abstraction layer sits between providers and storage, so each provider is just
  an adapter behind one interface.
- Writes are **idempotent**: replaying the same provider response never double-counts or
  corrupts a series, which is what keeps the store 100% consistent under API throttling
  and retries.
- **Redis caching** absorbs repeated reads and cuts latency; **Docker** keeps the deploy
  reproducible and the compute footprint small.

TODO(raj): the idempotent-writes story is the interesting part — 2–3 paragraphs on how
the write path detects replays (keys? versions? upserts?), one failure you hit, and what
the numbers looked like before/after Redis.

## Links

TODO(raj): add the repo link to this file's frontmatter (`repo:`).
