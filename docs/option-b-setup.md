# Option B Setup Guide

## Exact libraries to use

### Mobile

- `react-native`
- `react-native-vision-camera`
- `react-native-permissions`
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `react-native-safe-area-context`
- `react-native-screens`
- `@react-native-async-storage/async-storage`

### Backend

- `fastapi`
- `uvicorn[standard]`
- `insightface`
- `onnxruntime`
- `opencv-python-headless`
- `numpy`
- `pillow`
- `python-multipart`
- `boto3`
- `pydantic-settings`

## What each piece does

### `react-native-vision-camera`

Use it for:

- front-camera access
- selfie capture
- short video capture if you later support your own liveness fallback
- better control than Expo camera modules

### `FastAPI`

Use it for:

- voter enrollment endpoints
- liveness session creation
- face verification endpoints
- voter eligibility checks
- audit logging integration

### `InsightFace`

Use it for:

- face detection
- face alignment
- face embedding extraction
- 1:1 similarity comparison

You do not need to train ArcFace yourself. `InsightFace` already exposes strong pretrained pipelines built on ArcFace-style embeddings.

### `AWS Face Liveness`

Use it for:

- anti-spoofing
- replay/photo/deepfake resistance
- live-session confidence scoring

The mobile app should not decide the liveness result by itself. Your backend should create the session and fetch the final result from AWS.

## Practical architecture

```text
React Native App
  -> Capture face image/video
  -> POST to FastAPI backend

FastAPI
  -> Create AWS Face Liveness session
  -> Receive reference image after liveness passes
  -> Use InsightFace to compute embedding
  -> Compare against enrolled voter embedding
  -> Check voter registry eligibility
  -> Return allow/deny + reason
```

## Enrollment flow

1. Admin or voter starts registration.
2. Voter submits identity details.
3. App captures face samples.
4. Backend runs face extraction and quality checks.
5. Backend stores the embedding against the voter record.
6. Registry marks the voter as enrolled.

## Verification flow

1. Voter enters voter ID.
2. Mobile app starts liveness-assisted capture.
3. Backend receives liveness reference image.
4. Backend uses InsightFace to generate an embedding.
5. Backend compares the new embedding to the enrolled template for that voter.
6. Backend checks `eligible`, `active`, and `not_yet_voted`.
7. Backend returns success or failure.

## Suggested similarity rule

Do not hardcode a random threshold in production. Start with an experimentally tuned threshold from your own test set and keep logs so you can adjust it.

For this project, begin with:

- cosine similarity comparison
- one enrolled template per voter at minimum
- optional multiple enrollment images later for robustness

## Why not 1:N search

Do not search the whole voter database from a face alone.

Preferred voting flow:

- voter enters claimed identity first
- backend performs `1:1 verification`

That is simpler, more privacy-preserving, and easier to justify in your report.

## Local setup note

This workspace is ready for scaffolding, but dependency installation is blocked until a JavaScript package manager is available on this machine.
