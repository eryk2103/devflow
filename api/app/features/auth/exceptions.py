from app.core.exceptions import ConflictException

class AccountConflictException(ConflictException):
    def __init__(self, message: str = "Account with this email already exists"):
        super().__init__(message)
