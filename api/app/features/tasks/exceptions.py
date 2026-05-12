from app.core.exceptions import NotFoundException, ConflictException


class TaskNotFoundException(NotFoundException):
    def __init__(self, message: str = "Task not found"):
        super().__init__(message)

class TaskNameConflictException(ConflictException):
    def __init__(self, message: str = "Task with this name already exists"):
        super().__init__(message)