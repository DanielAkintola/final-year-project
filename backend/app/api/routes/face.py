from fastapi import APIRouter, File, Form, UploadFile, HTTPException

from app.core.config import settings
from app.schemas.face import EnrollmentResponse, VerificationResponse, GetResponse
from app.services.face_service import FaceService
from app.services.template_store import JsonTemplateStore

router = APIRouter(prefix="/face", tags=["face"])
face_service = FaceService()
template_store = JsonTemplateStore()


@router.post("/enroll", response_model=EnrollmentResponse)
async def enroll_face(
    voter_id: str = Form(...),
    image: UploadFile = File(...),
) -> EnrollmentResponse:
    image_bytes = await image.read()
    embedding = face_service.extract_embedding(image_bytes)
    template_store.save(voter_id, embedding)

    return EnrollmentResponse(
        voter_id=voter_id,
        status="enrolled",
        message="Face template enrolled for local prototype verification.",
    )


@router.get("/view_face/{voter_id}", response_model=GetResponse) 
def get_enrolled_face(
    voter_id: str
) -> GetResponse:
    enrolled_embedding = template_store.get(voter_id)

    if enrolled_embedding is None:
        raise HTTPException(status_code=404, detail="Item not found!!!")
    
    return  GetResponse(
        voter_id = voter_id,
        data = str(enrolled_embedding)
    )



@router.post("/verify", response_model=VerificationResponse)
async def verify_face(
    voter_id: str = Form(...),
    image: UploadFile = File(...),
) -> VerificationResponse:
    enrolled_embedding = template_store.get(voter_id) #@audit right here we set the template_store right here 

    if enrolled_embedding is None: #@audit if the enrolled embedding is None 
        return VerificationResponse(
            voter_id=voter_id,
            matched=False,
            similarity=0.0,
            eligible=False,
            message="No enrolled face template found for this voter.",
        )

    image_bytes = await image.read()
    probe_embedding = face_service.extract_embedding(image_bytes)
    result = face_service.compare_embeddings( 
        enrolled_embedding=enrolled_embedding,
        probe_embedding=probe_embedding,
        threshold=settings.face_match_threshold,
    )

    # Eligibility is intentionally false here. In the final architecture, Node.js
    # owns voter registry lookup and ballot access decisions.
    return VerificationResponse(
        voter_id=voter_id,
        matched=result.matched,
        similarity=result.similarity,
        eligible=False,
        message="Face matched. Eligibility must be checked by the Node.js voter registry."
        if result.matched
        else "Face did not match the enrolled template.",
    )
