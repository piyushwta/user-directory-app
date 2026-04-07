import { useEffect, useState, useMemo } from "react";
import { getUsers, saveUsers } from "./useLocalStorage";
import { mockUsers } from "../data/users";
import type { User } from "../types/user.types";
import { useDebounce } from "./useDebounce"; // ✅ import your debounce hook

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  // ✅ debounce the search value
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const stored = getUsers();
    const initialUsers = stored.length ? stored : mockUsers;
    setUsers(initialUsers);
    console.log("Users loaded:", initialUsers);
  }, []);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    console.log("Search value (debounced):", debouncedSearch);
  }, [debouncedSearch]);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      return (
        (u.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(debouncedSearch.toLowerCase())) &&
        (role ? u.role === role : true) &&
        (status ? u.status === status : true)
      );
    });
  }, [users, debouncedSearch, role, status]);

  return {
    users: filteredUsers,
    setSearch,
    setRole,
    setStatus,
    addUser,
  };
};