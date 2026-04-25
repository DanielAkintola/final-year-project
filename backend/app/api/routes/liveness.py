from fastapi import APIRouter

from app.schemas.face import LivenessSessionResponse
from app.services.liveness_service import LivenessService

router = APIRouter(prefix="/liveness", tags=["liveness"])


@router.post("/session", response_model=LivenessSessionResponse)
def create_liveness_session() -> LivenessSessionResponse:
    service = LivenessService()
    session = service.create_session()
    return LivenessSessionResponse(**session)


@router.get("/result/{session_id}")
def get_liveness_result(session_id: str) -> dict:
    service = LivenessService()
    return service.get_results(session_id)
