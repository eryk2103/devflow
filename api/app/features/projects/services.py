from app.features.projects.exceptions import ProjectNotFoundException, ProjectNameConflictException
from app.features.projects.models import Project
from app.features.projects.schemas import ProjectCreate, ProjectUpdate, ProjectPartial


def get_user_project(session, user_id: int, project_id: int):
    project = session.query(Project).filter(Project.id == project_id, Project.user_id == user_id).first()
    if not project:
        raise ProjectNotFoundException()
    return project


def create_project(session, project: ProjectCreate, user_id: int):
    project_db = session.query(Project).filter(Project.name == project.name, Project.user_id == user_id).first()
    if project_db:
        raise ProjectNameConflictException()
    new_project = Project(name=project.name, description=project.description, user_id=user_id)
    session.add(new_project)
    session.commit()
    session.refresh(new_project)
    return new_project


def update_project(session, project_id: int, project: ProjectUpdate, user_id: int):
    project_db = get_user_project(session, user_id, project_id)
    project_db.name = project.name
    project_db.description = project.description
    session.commit()
    session.refresh(project_db)
    return project_db


def partial_update_project(session, project_id: int, project: ProjectPartial, user_id: int):
    project_db = get_user_project(session, user_id, project_id)
    update_data = project.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project_db, key, value)
    session.commit()
    session.refresh(project_db)
    return project_db

def delete_project(session, project_id: int, user_id: int):
    project = get_user_project(session, user_id, project_id)
    session.delete(project)
    session.commit()