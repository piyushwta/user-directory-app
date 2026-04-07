const KEY = "users";

export const saveUsers = (users: any) => {
  localStorage.setItem(KEY, JSON.stringify(users));
};

export const getUsers = () => {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse users from localStorage", error);
    return [];
  }
};