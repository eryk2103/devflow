import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from starlette.testclient import TestClient

from app.core import config
from app.core.db import Base, get_db
from app.features.auth.service import hash_password, create_access_token
from app.features.users.models import User
from app.main import app


@pytest.fixture(scope="session")
def engine():
    engine = create_engine(config.settings.test_db_url)
    Base.metadata.create_all(bind=engine)

    yield engine

    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture()
def db_session(engine):
    connection = engine.connect()
    transaction = connection.begin()

    testing_sessionLocal: sessionmaker[Session] = sessionmaker(
        bind=connection,
        autoflush=False,
        autocommit=False,
        join_transaction_mode="create_savepoint",
    )

    session = testing_sessionLocal()

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()


@pytest.fixture()
def seed_user(db_session):
    user = User(email="test@example.com", hashed_password=hash_password("secret1234"))
    db_session.add(user)
    db_session.flush()
    db_session.refresh(user)

    return user

@pytest.fixture()
def seed_user_2(db_session):
    user = User(email="test2@example.com", hashed_password=hash_password("secret1234"))
    db_session.add(user)
    db_session.flush()
    db_session.refresh(user)

    return user


@pytest.fixture()
def req_headers(seed_user):
    token = create_access_token(seed_user).access_token
    return {"Authorization": f"Bearer {token}"}
