import { create } from 'zustand';
import { projectService, taskService, teamService } from '../services/api';

export const useProjectStore = create((set) => ({
  projects: [],
  currentProject: null,
  tasks: [],
  members: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true });
    try {
      const response = await projectService.getAll();
      set({ projects: response.data.projects });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchProjectById: async (projectId) => {
    set({ loading: true });
    try {
      const response = await projectService.getById(projectId);
      set({ currentProject: response.data.project });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createProject: async (data) => {
    try {
      const response = await projectService.create(data);
      set((state) => ({ projects: [...state.projects, response.data.project] }));
      return response.data.project;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateProject: async (projectId, data) => {
    try {
      const response = await projectService.update(projectId, data);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === projectId ? response.data.project : p)),
        currentProject: response.data.project,
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteProject: async (projectId) => {
    try {
      await projectService.delete(projectId);
      set((state) => ({ projects: state.projects.filter((p) => p.id !== projectId) }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchTasks: async (projectId, filters) => {
    set({ loading: true });
    try {
      const response = await taskService.getByProject(projectId, filters);
      set({ tasks: response.data.tasks });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  createTask: async (projectId, data) => {
    try {
      const response = await taskService.create(projectId, data);
      set((state) => ({ tasks: [...state.tasks, response.data.task] }));
      return response.data.task;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  updateTask: async (taskId, data) => {
    try {
      const response = await taskService.update(taskId, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? response.data.task : t)),
      }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  deleteTask: async (taskId) => {
    try {
      await taskService.delete(taskId);
      set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchMembers: async (projectId) => {
    try {
      const response = await teamService.getMembers(projectId);
      set({ members: response.data.members });
    } catch (error) {
      set({ error: error.message });
    }
  },

  addMember: async (projectId, data) => {
    try {
      const response = await teamService.addMember(projectId, data);
      set((state) => ({ members: [...state.members, response.data.member] }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  removeMember: async (projectId, userId) => {
    try {
      await teamService.removeMember(projectId, userId);
      set((state) => ({ members: state.members.filter((m) => m.user_id !== userId) }));
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },
}));
