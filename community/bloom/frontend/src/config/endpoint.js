const endpoints = {
  "logout": `${import.meta.env.VITE_API_URL}/auth/logout`,
  "find-match": `${import.meta.env.VITE_API_URL}/match/find-match`,
  "create-profile": `${import.meta.env.VITE_API_URL}/user/create-profile`,
};

export default endpoints;
