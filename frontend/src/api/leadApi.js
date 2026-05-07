import api from './axios';

export const fetchLeads = async () => {
  const { data } = await api.get('/leads');
  return data.data;
};

export const createLead = async (leadData) => {
  const { data } = await api.post('/leads', leadData);
  return data.data;
};