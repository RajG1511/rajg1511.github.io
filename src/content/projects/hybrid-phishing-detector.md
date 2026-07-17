---
title: Hybrid Phishing Detector
summary: A four-layer phishing detection cascade built for CSCE 439 at Texas A&M. The semantic ensemble hit 98.55% accuracy and 99.87% AUC-ROC across 149,558 emails.
dates: Mar 2026 – May 2026
stack: [Python, PyTorch, XGBoost, DistilBERT, BiLSTM, SHAP/LIME, FastAPI]
repo: https://github.com/RajG1511/HybridPhishingDetector
featured: true
order: 2
---

## What it is

A phishing detection framework I built with three classmates (Karthik Chitta, Nikola
Slavchev, and Kendell Taylor) for CSCE 439 at Texas A&M. The premise: a phishing email
can exploit weak authentication, deceptive links, persuasive language, or all of them at
once, so one classifier isn't enough. The system is a cascade where each layer looks at
a different kind of evidence, and a central scorer combines everything into a 0 to 100
risk score.

## How it works

1. **Protocol authentication.** Parses raw .eml files and checks SPF, DKIM, and ARC
   records, plus mismatches between the From, Reply-To, and Return-Path headers.
2. **Lexical URL analysis.** Extracts every link and measures entropy, raw IP hosts,
   suspicious TLDs, homoglyphs, shorteners, and subdomain depth. A WHOIS module adds
   domain age, since freshly registered domains show up in campaigns constantly.
3. **Semantic classification.** An ensemble over the email text itself: TF-IDF models
   stacked into a super learner, fused with a DistilBERT/BiLSTM path. It sorts each
   email into legitimate, human-written phishing, or AI-generated phishing.
4. **RAG contextual profiling.** For grey-zone scores (40 to 60), a retrieval layer can
   compare the email against the user's history before judging.

On top of the cascade, LIME and SHAP explain each verdict, and a narrative generator
turns the attributions into plain English. The whole thing runs behind a FastAPI
backend with a small UI for pasting an email or uploading an .eml file.

## Results

The semantic layer trained on 149,558 emails from 8 sources: 47% legitimate, 44% human
phishing, 9% AI phishing, balanced with SMOTE before training.

![Model comparison chart: the stacked ensemble and final combined model outperform LR, RF, SVM, XGBoost, and DistilBERT individually](/images/phishing-model-comparison.png)

The final combined model scored 98.55% accuracy, 97.65% macro F1, and 99.87% AUC-ROC
on a held-out test set. The stacked ensemble beat every individual model, including
DistilBERT on its own. Logistic regression over-flagged AI phishing and XGBoost
sometimes misread legitimate mail; stacking corrected both.

![Confusion matrix for the combined classifier on 8,974 test samples](/images/phishing-confusion-matrix.png)

The confusion matrix also shows where it still struggles: 42 AI-generated phishing
emails passed as legitimate because the text was polished enough to read like real
mail. Only 7 were confused with human phishing, which means the model actually learned
the stylistic difference between the two threat types.

## The finding I keep bringing up

The metadata model (XGBoost, picked over CatBoost after a straight comparison: 92.15%
vs 92.05% test F1) barely cared about the URLs. The top features were nearly all
protocol signals, with `arc_missing` alone at 0.279 importance:

![Top 10 feature importances for the XGBoost metadata and URL model](/images/phishing-feature-importances.png)

The technical envelope betrays an attacker before you ever read the links. We also had
to fight the model's laziness. Trained naively, it learns "missing SPF means phishing"
and stops there, so we synthetically granted perfect SPF/DKIM records to 10% of the
malicious samples to force it to find deeper patterns, the way a real compromised inbox
would look.

## Read more

The [full project writeup (PDF)](/docs/phishing-detector-writeup.pdf) has the
architecture tables, validation results, and per-class metrics.
