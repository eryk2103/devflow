import pytest

from app.features.tasks.models import Task, TaskStatus, TaskType, TaskPriority
from app.features.tasks.schemas import TaskCreate, TaskUpdate
from .test_projects_router import seed_project, seed_project_2


@pytest.fixture()
def seed_task(db_session, seed_project):
    task = Task(
        name="Test Task",
        description="This is a test task",
        project_id=seed_project.id,
        status=TaskStatus.DONE,
        type=TaskType.BUG,
        priority=TaskPriority.HIGH,
    )
    db_session.add(task)
    db_session.flush()

    return task


# Different project owner
@pytest.fixture()
def seed_task_2(db_session, seed_project_2):
    task = Task(
        name="Test Task 2",
        description="This is a test task 2",
        project_id=seed_project_2.id,
        status=TaskStatus.DONE,
        type=TaskType.BUG,
        priority=TaskPriority.HIGH,
    )
    db_session.add(task)
    db_session.flush()

    return task

# Same project owner, different name
@pytest.fixture()
def seed_task_3(db_session, seed_project):
    task = Task(
        name="Test Task 3",
        description="This is a test task 2",
        project_id=seed_project.id,
        status=TaskStatus.DONE,
        type=TaskType.BUG,
        priority=TaskPriority.HIGH,
    )
    db_session.add(task)
    db_session.flush()

    return task


def test_get_tasks(client, req_headers, seed_task, seed_project):
    response = client.get(f"/api/tasks?project={seed_project.id}&status={seed_task.status.value}", headers=req_headers)

    data = response.json()

    assert response.status_code == 200

    assert data[0]["id"] == seed_task.id
    assert data[0]["name"] == seed_task.name
    assert data[0]["description"] == seed_task.description
    assert data[0]["status"] == seed_task.status.value
    assert data[0]["type"] == seed_task.type.value
    assert data[0]["priority"] == seed_task.priority.value

    assert len(data) == 1


def test_get_tasks_empty(client, req_headers, seed_project):
    response = client.get(f"/api/tasks?project={seed_project.id}&status=DONE", headers=req_headers)

    assert response.status_code == 200
    assert response.json() == []


def test_get_tasks_invalid_status(client, req_headers, seed_project):
    response = client.get(f"/api/tasks?project={seed_project.id}&status=INVALID_STATUS", headers=req_headers)
    assert response.status_code == 422


def test_get_tasks_invalid_project(client, req_headers):
    response = client.get(f"/api/tasks?project=INVALID_PROJECT&status=DONE", headers=req_headers)
    assert response.status_code == 422


def test_get_tasks_project_not_found(client, req_headers):
    response = client.get(f"/api/tasks?project=999999&status=DONE", headers=req_headers)
    assert response.status_code == 404


def test_get_task(client, req_headers, seed_task):
    response = client.get(f"/api/tasks/{seed_task.id}", headers=req_headers)

    data = response.json()
    assert response.status_code == 200

    assert data["id"] == seed_task.id
    assert data["name"] == seed_task.name
    assert data["description"] == seed_task.description
    assert data["status"] == seed_task.status.value
    assert data["type"] == seed_task.type.value
    assert data["priority"] == seed_task.priority.value


def test_get_task_not_found(client, req_headers):
    response = client.get(f"/api/tasks/999999", headers=req_headers)
    assert response.status_code == 404


def test_get_task_denied(client, req_headers, seed_task_2):
    response = client.get(f"/api/tasks/{seed_task_2.id}", headers=req_headers)
    assert response.status_code == 404


def test_create_task(client, req_headers, seed_project):
    new_task = TaskCreate(name="New Task 2", description="This is a new task", status=TaskStatus.DONE,
                          type=TaskType.BUG, priority=TaskPriority.HIGH, project_id=seed_project.id)

    response = client.post("/api/tasks", json=new_task.model_dump(), headers=req_headers)

    data = response.json()

    assert response.status_code == 201

    assert data["name"] == new_task.name
    assert data["description"] == new_task.description
    assert data["status"] == new_task.status.value
    assert data["type"] == new_task.type.value
    assert data["priority"] == new_task.priority.value


def test_create_task_name_exists(client, req_headers, seed_task):
    new_task = TaskCreate(name=seed_task.name, description="This is a test task", status=TaskStatus.DONE,
                          type=TaskType.BUG, priority=TaskPriority.HIGH, project_id=seed_task.project_id)

    request = client.post("/api/tasks", json=new_task.model_dump(), headers=req_headers)

    assert request.status_code == 409


def test_create_task_project_not_found(client, req_headers):
    new_task = TaskCreate(name="New Task 2", description="This is a new task", status=TaskStatus.DONE,
                          type=TaskType.BUG, priority=TaskPriority.HIGH, project_id=999999)

    request = client.post("/api/tasks", json=new_task.model_dump(), headers=req_headers)
    assert request.status_code == 404


def test_update_task(client, req_headers, seed_task):
    update_task = TaskUpdate(name="Updated Task", description="This is an updated task", status=TaskStatus.DONE,
                             type=TaskType.BUG, priority=TaskPriority.HIGH)

    response = client.put(f"/api/tasks/{seed_task.id}", json=update_task.model_dump(), headers=req_headers)

    data = response.json()

    assert response.status_code == 200

    assert data["id"] == seed_task.id
    assert data["name"] == update_task.name
    assert data["description"] == update_task.description
    assert data["status"] == update_task.status.value
    assert data["type"] == update_task.type.value
    assert data["priority"] == update_task.priority.value


def test_update_task_not_found(client, req_headers):
    update_task = TaskUpdate(name="Updated Task", description="This is an updated task", status=TaskStatus.DONE,
                             type=TaskType.BUG, priority=TaskPriority.HIGH)

    response = client.put(f"/api/tasks/999999", json=update_task.model_dump(), headers=req_headers)
    assert response.status_code == 404


def test_update_task_name_exists(client, req_headers, seed_task, seed_task_3):
    update_task = TaskUpdate(name=seed_task_3.name, description="This is an updated task", status=TaskStatus.DONE,
                             type=TaskType.BUG, priority=TaskPriority.HIGH)

    response = client.put(f"/api/tasks/{seed_task.id}", json=update_task.model_dump(), headers=req_headers)
    assert response.status_code == 409


def test_update_task_denied(client, req_headers, seed_task_2):
    update_task = TaskUpdate(name="Updated Task", description="This is an updated task", status=TaskStatus.DONE,
                             type=TaskType.BUG, priority=TaskPriority.HIGH)

    response = client.put(f"/api/tasks/{seed_task_2.id}", json=update_task.model_dump(), headers=req_headers)
    assert response.status_code == 404


def test_partial_update_task(client, req_headers, seed_task):
    response = client.patch(f"/api/tasks/{seed_task.id}", json={"name": "Patched Task"}, headers=req_headers)

    data = response.json()

    assert response.status_code == 200

    assert data["id"] == seed_task.id
    assert data["name"] == "Patched Task"
    assert data["description"] == seed_task.description
    assert data["status"] == seed_task.status.value
    assert data["type"] == seed_task.type.value
    assert data["priority"] == seed_task.priority.value


def test_partial_update_task_not_found(client, req_headers):
    response = client.patch(f"/api/tasks/999999", json={"name": "Patched Task"}, headers=req_headers)
    assert response.status_code == 404


def test_partial_update_task_name_exists(client, req_headers, seed_task, seed_task_3):
    response = client.patch(f"/api/tasks/{seed_task.id}", json={"name": seed_task_3.name}, headers=req_headers)
    assert response.status_code == 409


def test_partial_update_task_denied(client, req_headers, seed_task_2):
    response = client.patch(f"/api/tasks/{seed_task_2.id}", json={"name": "Patched Task"}, headers=req_headers)
    assert response.status_code == 404


def test_delete_task(client, req_headers, seed_task):
    response = client.delete(f"/api/tasks/{seed_task.id}", headers=req_headers)
    assert response.status_code == 204


def test_delete_task_not_found(client, req_headers):
    response = client.delete(f"/api/tasks/999999", headers=req_headers)
    assert response.status_code == 404


def test_delete_task_denied(client, req_headers, seed_task_2):
    response = client.delete(f"/api/tasks/{seed_task_2.id}", headers=req_headers)
    assert response.status_code == 404
