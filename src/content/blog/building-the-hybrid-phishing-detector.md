---
title: What I learned building a phishing detector
date: 2026-07-16
summary: Development notes from the Hybrid Phishing Detector, a four-layer email security cascade built for CSCE 439. The headers snitch before the links do.
tags: [ml, security, projects]
draft: false
---

Last spring, three classmates and I built a phishing detection system for CSCE 439 at
Texas A&M. The short version is on the [project page](/projects/hybrid-phishing-detector/).
This is the longer version: what we tried, what broke, and the one finding I still bring
up in conversations.

## One classifier was never going to work

A phishing email can attack you three different ways: forged sender infrastructure,
deceptive links, or persuasive text. Sometimes all at once. A single model trained on
email text sees only the third one, and modern attackers write with LLMs now, so the
text is often clean.

We built a cascade instead. Layer 1 parses raw .eml files and checks SPF, DKIM, and ARC
records plus header mismatches. Layer 2 tears apart every URL: entropy, raw IP hosts,
homoglyphs, shorteners, subdomain depth, and domain age over WHOIS. Layer 3 is the
semantic ensemble that reads the actual text. A scorer blends everything into one 0 to
100 risk number, and scores between 40 and 60 get flagged as grey zone for a future
retrieval layer that would compare the email against the user's history.

## The model kept taking shortcuts

The most annoying lesson came from training the metadata classifier. Our malicious
samples mostly came from older corpora with weak or missing authentication records, so
the model learned "missing SPF means phishing" and stopped learning anything else. It
scored well and it was useless. A real attacker sending from a compromised inbox passes
SPF just fine.

The fix was synthetic augmentation. We upgraded a chunk of the legitimate emails to
modern authentication settings and deliberately granted perfect SPF and DKIM records to
10% of the malicious samples. Accuracy on paper got harder to earn, and the model got
meaningfully better at the cases that matter.

## The headers snitch before the links do

We compared XGBoost and CatBoost for the metadata layer. XGBoost won by a hair (92.15%
vs 92.05% test F1), and when we pulled its feature importances, the result surprised
me: the URL features barely mattered. The top signal was `arc_missing` at 0.279
importance, followed by our composite protocol risk score and `dkim_pass`. The
technical envelope betrays an attacker before you ever read the links inside.

## Stacking actually earned its complexity

For the text itself we trained on 149,558 emails from 8 sources, split three ways:
legitimate, human-written phishing, and AI-generated phishing. Individual models each
had a blind spot. Logistic regression over-flagged AI phishing (83.9% precision on that
class). XGBoost sometimes misread legitimate mail (93.5% recall). A stacked super
learner fused with a DistilBERT/BiLSTM path fixed both and landed at 98.55% accuracy
with 99.87% AUC-ROC on the held-out test set.

The confusion matrix still tells an honest story: 42 AI-generated phishing emails got
past us as legitimate, because the text was polished enough to read like real mail.
Only 7 got confused with human phishing. The model genuinely learned the stylistic
difference between the two threat types. It just can't always beat an LLM that writes
better email than most people do.

## What I'd do differently

The repo is an implementation-focused prototype: the trained artifacts were too big to
commit, the NLTK resources need separate downloads, and the RAG layer is scaffolded but
not wired into final decisions. If I picked it back up, the first move would be
packaging the model artifacts properly and measuring latency per layer, since a
security tool that's right but slow doesn't get deployed.

The [full writeup (PDF)](/docs/phishing-detector-writeup.pdf) has the architecture
tables and per-class metrics. Credit where due: this was joint work with Karthik
Chitta, Nikola Slavchev, and Kendell Taylor.
