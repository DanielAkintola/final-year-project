# Ondo Voting System Prototype

This workspace is set up for `Option B`:

- `mobile/`: React Native app for voter capture and voting flow
- `admin/`: React admin web app for election setup and monitoring
- `api/`: Node.js main backend for auth, voter registry, election config, voting, and admin APIs
- `backend/`: Python face service for AWS Face Liveness orchestration and InsightFace-based 1:1 verification
- `docs/`: architecture and setup notes

## Recommended stack

### Mobile

- React Native CLI (bare workflow)
- `react-native-vision-camera` for selfie/video capture
- `react-native-permissions` for camera permission handling
- `@react-native-async-storage/async-storage` for local state/session caching

### Main Backend

- Node.js
- Express
- `cors`, `helmet`, `morgan`
- `axios` for calling the Python face service

### Face Service

- FastAPI
- Uvicorn
- `insightface` for face detection/alignment/embeddings
- `onnxruntime` to run the underlying face model efficiently
- `boto3` for AWS Face Liveness session APIs
- `opencv-python-headless`, `numpy`, `Pillow` for image processing

## Why this split

- `VisionCamera` handles high-quality live image capture on the device.
- `AWS Face Liveness` confirms the person is physically present.
- `InsightFace` generates embeddings for 1:1 voter verification.
- `Express` exposes the main API for mobile and web clients.
- `FastAPI` keeps biometric matching and liveness orchestration in a dedicated service.

## Important design rule

Face verification should confirm identity. Voter eligibility should come from the voter registry managed by the Node.js API.

Flow:

1. Voter enters voter ID.
2. Mobile app captures live face input.
3. Node.js API requests liveness and verification from the face service.
4. Face service compares the live face embedding to the enrolled embedding for that voter.
5. Node.js API checks voter eligibility and voting status.
6. If all checks pass, the ballot is released.

## Current state

This repo is scaffolded locally, but JavaScript package installation has not been run because this machine currently has `node` available without `npm`, `yarn`, `pnpm`, or `corepack`.

See [docs/option-b-setup.md](/Users/dan__vinci/Downloads/final-year-project/docs/option-b-setup.md) for the concrete implementation plan.
See [docs/api-endpoints.md](/Users/dan__vinci/Downloads/final-year-project/docs/api-endpoints.md) for the full Node.js API surface.
See [docs/face-recognition-demo.md](/Users/dan__vinci/Downloads/final-year-project/docs/face-recognition-demo.md) for the first local face-recognition test.
See [docs/mongoose-schemas.md](/Users/dan__vinci/Downloads/final-year-project/docs/mongoose-schemas.md) for the admin/voting database object model.
See [docs/admin-actions-todo.md](/Users/dan__vinci/Downloads/final-year-project/docs/admin-actions-todo.md) for the admin web build checklist.
