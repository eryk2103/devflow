from app.core.exceptions import ConflictException, NotFoundException


class AccountConflictException(ConflictException):
    def __init__(self, message: str = "Account with this email already exists"):
        super().__init__(message)

class InvalidRefreshTokenException(Exception):
    def __init__(self, message: str = "Invalid refresh token"):
        super().__init__(message)

class RefreshTokenExpiredException(Exception):
    def __init__(self, message: str = "Refresh token expired"):
        super().__init__(message)