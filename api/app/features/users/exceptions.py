from app.core.exceptions import NotFoundException, ConflictException


class UserNotFoundException(NotFoundException):
    def __init__(self, message: str = "User not found"):
        super().__init__(message)

class UserEmailConflictException(ConflictException):
    def __init__(self, message: str = "User with this email already exists"):
        super().__init__(message)