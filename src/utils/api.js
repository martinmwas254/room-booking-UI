export const api = async (endpoint, method = 'GET', body = null, token = null) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
  
    const res = await fetch(`https://room-booking-server-j6su.onrender.com/api/${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
  
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Something went wrong');
    return data;
  };
  