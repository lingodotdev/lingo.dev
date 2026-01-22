const fetchWithoutToken = async (url, options) => {
  const headers = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response;
};

export default fetchWithoutToken;


export const postReq = async (url, body) => {
  const response = await fetchWithoutToken(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  return response;
};

export const getReq = async (url) => {
  const response = await fetchWithoutToken(url, {
    method: "GET",
  });
  return response;
};