---
title: A&M Grade Data Insights
summary: A RAG conversational agent over Texas A&M academic data — ask course questions in English, get answers backed by 10,000+ normalized grade records.
dates: Dec 2024 – Jan 2025
stack: [Python, FastAPI, pgvector, React, AWS RDS (MySQL)]
repo: https://github.com/RajG1511/TAMU_GPA_DIST
featured: true
order: 3
---

## What it is

A conversational agent for data-backed course selection at Texas A&M: ask a question in
plain English, get an answer grounded in real grade distribution data.

<!-- TODO(raj): confirm the repo URL above is correct. -->

## How it works

- A **Python ETL pipeline** scrapes and normalizes **10,000+ records** into a
  high-availability **AWS RDS** instance.
- A **FastAPI** service with **pgvector** does retrieval-augmented generation over the
  academic data, so answers cite actual distributions instead of vibes.
- A **React frontend** visualizes the underlying database insights.

TODO(raj): depth — the messiest part of the scraping/normalization, and how retrieval
quality was checked.
