from app.core.exceptions import NotFoundException, ConflictException


class ProjectNotFoundException(NotFoundException):
    def __init__(self, message: str = "Project not found"):
        super().__init__(message)

class ProjectNameConflictException(ConflictException):
    def __init__(self, message: str = "Project with this name already exists"):
        super().__init__(message)