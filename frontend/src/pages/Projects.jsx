import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '../context/projectStore';
import '../styles/projects.css';

export default function Projects() {
  const navigate = useNavigate();
  const { projects, fetchProjects, loading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>📁 Projects</h1>
        <button className="btn-primary" onClick={() => navigate('/projects/new')}>
          + New Project
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading projects...</div>
      ) : projects.length > 0 ? (
        <div className="projects-list">
          {projects.map((project) => (
            <div key={project.id} className="project-item">
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.description || 'No description'}</p>
                <small>Created on {new Date(project.created_at).toLocaleDateString()}</small>
              </div>
              <button
                className="btn-secondary"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                Open
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No projects yet. Create one to get started!</p>
          <button
            className="btn-primary"
            onClick={() => navigate('/projects/new')}
          >
            Create Project
          </button>
        </div>
      )}
    </div>
  );
}
