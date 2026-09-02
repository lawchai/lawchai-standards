# LawChai Product Starter

Baseline web-product starter for LawChai applications.

## Purpose

Provides a pinned, reusable template for React/TypeScript products with standardized persistence, evidence state tracking, accessibility defaults, and automated CI integration.

## Minimum Product Journey

`open -> understand purpose -> perform primary action -> receive concrete output -> save/resume where needed -> recover/reset where needed`

## Verification & Commands

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## Evidence & Truth Baseline

Explicit states used in this product:
- `KNOWN`
- `UNKNOWN`
- `SYNTHETIC`
- `OBSERVED`
- `DERIVED`
- `HYPOTHESIS`

Synthetic data disclosure: All sample pre-populated items are synthetic fixtures and must be labelled as `SYNTHETIC`.

## Standards Pinning & Governance

This repository consumes `lawchai/lawchai-standards`. CI workflow references reusable workflows by full commit SHA.
