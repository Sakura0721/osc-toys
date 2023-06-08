from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from routers.coyote import ci
from settings import settings


router = APIRouter(prefix="/api/osc_server")


class OSCAddress(BaseModel):
    host: str
    port: str


@router.post("/address")
async def update_address(req: OSCAddress):
    """
    Set the OSC address of the device.
    """
    if ci.is_connected:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot change the address while connected.",
        )
    try:
        settings.vrc_host = req.host
        settings.vrc_osc_port = req.port
        return {"msg": "success"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )


@router.get("/address")
async def get_address():
    """
    Get the OSC address of the device.
    """
    try:
        return {
            "host": settings.vrc_host,
            "port": settings.vrc_osc_port,
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
