
def test_get_user(client, req_headers, seed_user):
    response = client.get("/api/users/me", headers=req_headers)

    data = response.json()
    assert response.status_code == 200
    assert data["id"] == seed_user.id
    assert data["email"] == seed_user.email

