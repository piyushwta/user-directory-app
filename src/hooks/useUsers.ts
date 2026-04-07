import { useEffect, useState, useMemo } from "react";
import { getUsers, saveUsers } from "./useLocalStorage";
import { mockUsers } from "../data/users";
import type { User } from "../types/user.types";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const stored = getUsers();
    const initialUsers = stored.length ? stored : mockUsers;
    setUsers(initialUsers);
    console.log("Users loaded:", initialUsers); // ✅ correct
  }, []);

  useEffect(() => {
    saveUsers(users);
  }, [users]);

  useEffect(() => {
    console.log("Search value:", search);
  }, [search]);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, { ...user, id: Date.now() }]);
  };

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      return (
        (u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())) &&
        (role ? u.role === role : true) &&
        (status ? u.status === status : true)
      );
    });
  }, [users, search, role, status]);

  return {
    users: filteredUsers,
    setSearch,
    setRole,
    setStatus,
    addUser,
  };
};
