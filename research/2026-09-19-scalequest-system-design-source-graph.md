# Research Memory — ScaleQuest system-design source graph

Date: 2026-09-19
Status: ACTIVE / PARTIAL_SOURCE_RECOVERY
Applicability: High for `os`, `rr`, architecture/product research, reliability/scalability design, learning products, and technical evaluation.

## User intent

Retain the ScaleQuest system-design concepts as reusable LawChai knowledge and make them eligible evidence/context for future `os` work.

## Provenance boundary

Primary seed:
- https://scalequest.io/sources

Current recovery limitation:
- the ScaleQuest `/sources` page itself was not retrievable by the current web executor on 2026-09-19;
- therefore the exact 87-entry catalog is **UNKNOWN** and must not be reconstructed from memory or silently substituted with a generic system-design syllabus.

Externally corroborated description:
- Reddit r/softwarearchitecture post dated 2026-09-16: “Free list of 87 system design concepts, each linked to the original paper/RFC/docs.”
- The post explicitly names the range/examples: **HTTP basics, Raft, sharding, backpressure, load shedding**.
- Public ScaleQuest material describes its learning mechanic as making architecture decisions and seeing their consequences.
- A current public ScaleQuest autoscaling scenario demonstrates oscillation/flapping caused by the controller changing the signal it observes, and teaches asymmetric control / hysteresis as the corrective mechanic.

## Recovered concept memory

### 1. HTTP semantics / HTTP basics
Source:
- RFC 9110 — HTTP Semantics: https://www.rfc-editor.org/rfc/rfc9110.html

Core mechanic:
- HTTP is a stateless application-level request/response protocol with uniform resource semantics.
- System design decisions should distinguish method semantics, status semantics, representation metadata, intermediaries, caching behavior, and connection/transport details rather than treating “HTTP” as a single opaque pipe.

Use in `os`:
- API boundary design;
- proxy/gateway/CDN behavior;
- idempotency and retry analysis;
- caching/validation decisions;
- failure/status behavior.

### 2. Raft consensus
Sources:
- Ongaro & Ousterhout, “In Search of an Understandable Consensus Algorithm”: https://www.usenix.org/conference/atc14/technical-sessions/presentation/ongaro
- https://raft.github.io/

Core mechanic:
- Raft manages a replicated log through a strong leader and separates consensus into leader election, log replication, and safety.
- Consensus is relevant when multiple nodes must agree on ordered state despite failures; it is not a generic answer for replication, high availability, or every distributed write path.

Use in `os`:
- metadata/control-plane state;
- configuration coordination;
- replicated state machines;
- leader failover;
- correctness analysis under partitions/failures.

### 3. Sharding / partitioning
ScaleQuest inclusion: explicitly corroborated by the 2026-09-16 source-list post.

Core mechanic:
- split a dataset/workload across independently scalable partitions;
- partition-key choice determines distribution, locality, hotspot risk, rebalance cost, and cross-shard operation complexity;
- sharding increases capacity but creates coordination, routing, resharding, and secondary-index tradeoffs.

Use in `os`:
- dataset or traffic no longer fits one node;
- tenant isolation;
- hotspot diagnosis;
- geographic/data-locality design;
- write/read scaling.

### 4. Backpressure
Authoritative reference:
- Reactive Streams specification: https://github.com/reactive-streams/reactive-streams-jvm

Core mechanic:
- an asynchronous producer must not be allowed to overwhelm a slower consumer indefinitely;
- backpressure makes downstream capacity/consumption constrain upstream production or admission;
- bounded queues, demand signalling, concurrency limits, and controlled rejection are preferable to unbounded backlog.

Use in `os`:
- queues/event pipelines;
- streaming;
- fan-out;
- worker pools;
- API dependency saturation;
- memory/latency runaway prevention.

### 5. Load shedding
ScaleQuest inclusion: explicitly corroborated by the 2026-09-16 source-list post.

Core mechanic:
- deliberately reject, defer, degrade, or drop lower-value work when serving all demand would push the system into collapse;
- protect the critical path before saturation amplifies latency, retries, queue growth, and cascading failure;
- shedding policy requires priority, admission criteria, observable saturation signals, and recovery behavior.

Use in `os`:
- overload control;
- graceful degradation;
- priority traffic;
- failure isolation;
- retry-storm/cascade mitigation.

### 6. Autoscaling hysteresis / anti-flapping control
ScaleQuest public scenario:
- current ScaleQuest LinkedIn scenario on video-quality/autoscaling oscillation.

Corroborating current implementation reference:
- Kubernetes HPA supports directional scaling rules, stabilization windows, and tolerance explicitly to prevent flapping:
  https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/

Core mechanic:
- if a controller action changes the metric it observes, symmetric immediate reactions can create oscillation;
- use hysteresis, stabilization windows, tolerances, asymmetric scale-up/scale-down rules, and bounded rates of change;
- faster reaction is not always more stable.

Use in `os`:
- autoscaling;
- adaptive bitrate;
- cache/queue controllers;
- retry/admission controls;
- feedback loops generally.

## Reusable decision pattern

For system-design work, prefer:

`LOAD / FAILURE MODEL -> BOTTLENECK -> CONTROL MECHANISM -> FEEDBACK EFFECT -> FAILURE MODE -> GUARDRAIL -> OBSERVABLE EVIDENCE`

Examples:
- too much producer throughput -> backpressure;
- overload threatens critical service -> load shedding;
- dataset capacity/distribution limit -> sharding;
- ordered replicated control state -> consensus/Raft;
- controller oscillates around a threshold -> hysteresis/stabilization;
- API contract/intermediary behavior matters -> HTTP semantics.

Do not select a mechanism by keyword alone. Match the failure/load model and preserve tradeoffs.

## `os` retrieval contract

When an `os` task materially touches system architecture, distributed systems, API design, scalability, reliability, queues/streams, storage, replication, consistency, overload, or autoscaling:

1. Search this research record and fresher LawChai research first.
2. Treat the recovered ScaleQuest concepts as **candidate mechanics**, not automatic prescriptions.
3. Re-check current authoritative specifications/docs when version-sensitive or consequential.
4. Prefer original papers/RFCs/docs over tertiary tutorials.
5. Expose assumptions and unknowns.
6. If the exact ScaleQuest 87-item source page becomes recoverable, ingest the remaining concepts delta-first and update this file rather than creating a parallel corpus.
7. Never claim the reconstructed corpus is the exact ScaleQuest catalog until the page is directly recovered.

## Learning/product pattern

ScaleQuest's stronger reusable teaching pattern is:

`SCENARIO -> DECISION -> CONSEQUENCE -> MECHANIC -> PRIMARY SOURCE -> TRANSFER SCENARIO`

This should be considered for Recall//OS/Aetheria/technical learning surfaces where it improves transfer learning without fabricating outcomes.

## Current disposition

- exact ScaleQuest 87-item list: **UNKNOWN / PENDING DIRECT RECOVERY**
- six currently recoverable concepts/mechanics above: **LEARNED / REUSABLE**
- source-first concept graph: **ADOPTED**
- scenario -> decision -> consequence teaching loop: **REUSABLE PRODUCT PATTERN**
- third-party wording/content/branding: **DO NOT COPY**
