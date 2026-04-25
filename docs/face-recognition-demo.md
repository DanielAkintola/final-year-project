# Face Recognition Demo

This is the fastest way to see the face-recognition part work before building the admin website or database.

## What we are testing

```text
image A -> InsightFace embedding
image B -> InsightFace embedding
embeddings -> cosine similarity -> matched true/false
```

This proves the same 1:1 verification logic the voting flow will use after liveness succeeds.

## Install Python dependencies

From the project root:

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

The first time InsightFace runs, it may download the pretrained `buffalo_l` model.

## Try two images directly

Put test images somewhere like:

```text
backend/demo-images/person-a-1.jpg
backend/demo-images/person-a-2.jpg
backend/demo-images/person-b-1.jpg
```

Compare the same person:

```bash
python scripts/demo_face_match.py \
  demo-images/person-a-1.jpg \
  demo-images/person-a-2.jpg
```

Compare different people:

```bash
python scripts/demo_face_match.py \
  demo-images/person-a-1.jpg \
  demo-images/person-b-1.jpg
```

Expected output format:

```text
similarity=0.6123
threshold=0.4500
matched=true
```

The exact similarity values depend on the images and lighting.

## Try through FastAPI

Start the Python service:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Enroll a voter template:

```bash
curl -X POST http://localhost:8000/api/v1/face/enroll \
  -F voter_id=VOTER-001 \
  -F image=@demo-images/person-a-1.jpg
```

Verify the same voter:

```bash
curl -X POST http://localhost:8000/api/v1/face/verify \
  -F voter_id=VOTER-001 \
  -F image=@demo-images/person-a-2.jpg
```

## Important limitations

This local demo does not yet include AWS Face Liveness. It only proves face embedding and 1:1 matching.

For the real voting flow:

- liveness check must happen before face verification
- Node.js must check voter eligibility
- templates should be stored encrypted in a real database
- raw face images should not be kept unless there is a clear legal/privacy reason
