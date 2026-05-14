from pydantic import BaseModel, Field
from pydantic import EmailStr


class RegisterUser(BaseModel):
    email: EmailStr = Field(min_length=1, max_length=200)
    password: str = Field(min_length=8, max_length=250)


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None


class TokenList(BaseModel):
    access_token: Token
    refresh_token: str


class RefreshTokenCookies(BaseModel):
    refresh_token: str
