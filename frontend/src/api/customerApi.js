import api from './axios';

export const fetchCustomers = async () => {
  const { data } = await api.get('/customers');
  return data.data; // Returning the array of customers from our backend response
};

export const createCustomer = async (customerData) => {
  const { data } = await api.post('/customers', customerData);
  return data.data;
};

export const deleteCustomer = async (id) => {
  const { data } = await api.delete(`/customers/${id}`);
  return data;
};