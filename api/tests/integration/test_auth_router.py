from tests.conftest import client, seed_user

def test_register(client):
    response = client.post("/auth/register", json={"email": "new_email@example.com", "password": "Test1234!"})
    assert response.status_code == 204


def test_register_duplicate_email(client, seed_user):
    response = client.post("/auth/register", json={"email": "test@example.com", "password": "Test1234!"})
    assert response.status_code == 409


def test_login(client, seed_user):
    response = client.post(
        "/auth/login",
        headers={
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "password",
            "username": "test@example.com",
            "password": "secret1234"
        }
    )

    assert response.status_code == 200


def test_login_invalid_credentials(client, seed_user):
    response = client.post(
        "/auth/login",
        headers={
            "accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "password",
            "username": "test@example.com",
            "password": "secret12345678"
        }
    )

    assert response.status_code == 401
