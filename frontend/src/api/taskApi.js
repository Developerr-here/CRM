import api from './axios';

export const fetchTasks = async () => {
  const { data } = await api.get('/tasks');
  return data.data;
};

export const createTask = async (taskData) => {
  const { data } = await api.post('/tasks', taskData);
  return data.data;
};

export const updateTask = async (id, updateData) => {
  const { data } = await api.put(`/tasks/${id}`, updateData);
  return data.data;
};