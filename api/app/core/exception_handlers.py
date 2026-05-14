from fastapi import Request
from fastapi.responses import JSONResponse

from app.core.exceptions import NotFoundException, ConflictException


async def not_found_exception_handler(_request: Request, exc: NotFoundException):
    return JSONResponse(
        status_code=404,
        content={"error": exc.message or "Resource not found"},
    )

async def conflict_exception_handler(_request: Request, exc: ConflictException):
    return JSONResponse(
        status_code=409,
        content={"error": exc.message or "Conflict occurred"},
    )