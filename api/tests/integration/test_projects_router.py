import pytest

from app.features.projects.models import Project
from app.features.projects.schemas import ProjectCreate, ProjectUpdate
from tests.conftest import db_session, seed_user, req_headers


@pytest.fixture()
def seed_project(db_session, seed_user):
    project = Project(name="Test Project", description="This is a test project", user_id=seed_user.id)
    db_session.add(project)
    db_session.flush()
    return project


# Different project owner
@pytest.fixture()
def seed_project_2(db_session, seed_user_2):
    project = Project(name="Test Project 2", description="This is a test project 2", user_id=seed_user_2.id)
    db_session.add(project)
    db_session.flush()
    return project


def test_get_projects(client, seed_project, req_headers):
    response = client.get("/api/projects", headers=req_headers)

    data = response.json()
    assert response.status_code == 200

    assert data[0]["id"] == seed_project.id
    assert data[0]["name"] == seed_project.name
    assert data[0]["description"] == seed_project.description

    assert len(data) == 1


def test_get_projects_empty(client, req_headers):
    response = client.get("/api/projects", headers=req_headers)

    assert response.status_code == 200
    assert response.json() == []


def test_get_project(client, seed_project, req_headers):
    response = client.get(f"/api/projects/{seed_project.id}", headers=req_headers)

    data = response.json()

    assert response.status_code == 200

    assert data["id"] == seed_project.id
    assert data["name"] == seed_project.name
    assert data["description"] == seed_project.description


def test_get_project_not_found(client, req_headers):
    response = client.get(f"/api/projects/999999", headers=req_headers)
    assert response.status_code == 404


def test_get_project_denied(client, seed_project_2, req_headers):
    response = client.get(f"/api/projects/{seed_project_2.id}", headers=req_headers)
    assert response.status_code == 404


def test_create_project(client, req_headers):
    new_project = ProjectCreate(name="New Project", description="This is a new project")
    response = client.post("/api/projects", json=new_project.model_dump(), headers=req_headers)

    data = response.json()

    assert response.status_code == 201

    assert data["name"] == new_project.name
    assert data["description"] == new_project.description


def test_create_project_name_exists(client, seed_project, req_headers):
    new_project = ProjectCreate(name=seed_project.name, description="This is a new project")
    response = client.post("/api/projects", json=new_project.model_dump(), headers=req_headers)

    assert response.status_code == 409


def test_update_project(client, seed_project, req_headers):
    update_project = ProjectUpdate(name="Updated Project", description="This is an updated project")
    response = client.put(f"/api/projects/{seed_project.id}", json=update_project.model_dump(), headers=req_headers)

    data = response.json()
    assert response.status_code == 200

    assert data["id"] == seed_project.id
    assert data["name"] == update_project.name
    assert data["description"] == update_project.description


def test_update_project_without_name_change(client, seed_project, req_headers):
    update_project = ProjectUpdate(name=seed_project.name, description="This is an updated project")
    response = client.put(f"/api/projects/{seed_project.id}", json=update_project.model_dump(), headers=req_headers)

    data = response.json()
    assert response.status_code == 200

    assert data["id"] == seed_project.id
    assert data["name"] == update_project.name
    assert data["description"] == update_project.description


def test_update_project_not_found(client, req_headers):
    update_project = ProjectUpdate(name="Updated Project", description="This is an updated project")
    response = client.put(f"/api/projects/999999", json=update_project.model_dump(), headers=req_headers)
    assert response.status_code == 404


def test_update_project_denied(client, seed_project_2, req_headers):
    update_project = ProjectUpdate(name="Updated Project", description="This is an updated project")
    response = client.put(f"/api/projects/{seed_project_2.id}", json=update_project.model_dump(), headers=req_headers)
    assert response.status_code == 404


def test_partial_update_project(client, seed_project, req_headers):
    response = client.patch(f"/api/projects/{seed_project.id}", json={"name": "Patched Project"}, headers=req_headers)

    data = response.json()
    assert response.status_code == 200

    assert data["id"] == seed_project.id
    assert data["name"] == "Patched Project"
    assert data["description"] == seed_project.description


def test_partial_update_project_without_name_change(client, seed_project, req_headers):
    response = client.patch(f"/api/projects/{seed_project.id}", json={"name": seed_project.name}, headers=req_headers)

    data = response.json()
    assert response.status_code == 200

    assert data["id"] == seed_project.id
    assert data["name"] == seed_project.name
    assert data["description"] == seed_project.description

def test_partial_update_project_not_found(client, req_headers):
    response = client.patch(f"/api/projects/999999", json={"name": "Patched Project"}, headers=req_headers)
    assert response.status_code == 404


def test_partial_update_project_denied(client, seed_project_2, req_headers):
    response = client.patch(f"/api/projects/{seed_project_2.id}", json={"name": "Patched Project"}, headers=req_headers)
    assert response.status_code == 404


def test_delete_project(client, seed_project, req_headers):
    response = client.delete(f"/api/projects/{seed_project.id}", headers=req_headers)
    assert response.status_code == 204


def test_delete_project_not_found(client, req_headers):
    response = client.delete(f"/api/projects/999999", headers=req_headers)
    assert response.status_code == 404


def test_delete_project_denied(client, seed_project_2, req_headers):
    response = client.delete(f"/api/projects/{seed_project_2.id}", headers=req_headers)
    assert response.status_code == 404
