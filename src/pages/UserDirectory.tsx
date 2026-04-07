import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { SearchBar } from "../components/ui/user/SearchBar";
import { FilterPanel } from "../components/ui/user/FilterPanel";
import { UserList } from "../components/ui/user/UserList";
import { UserDetails } from "../components/ui/user/UserDetails";
import { AddUserForm } from "../components/ui/user/AddUserForm";

const UserDirectory = () => {
    const { users, setSearch, setRole, setStatus, addUser } = useUsers();
    const [selectedUser, setSelectedUser] = useState(null);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="border-b bg-white px-4 py-4 sm:px-6">
                <h1 className="text-xl font-semibold text-gray-900">
                    User Directory
                </h1>
                <p className="text-sm text-gray-500">
                    Manage users, roles, and access
                </p>
            </div>

            {/* 🔷 Main Layout */}
            <div className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* 🔹 LEFT SECTION */}
                    <div className="flex-1 space-y-4">

                        {/* Search + Filter */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border space-y-4">
                            <SearchBar onSearch={setSearch} />
                            <FilterPanel setRole={setRole} setStatus={setStatus} />
                        </div>

                        {/* User List */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border">
                            <UserList users={users} onSelect={setSelectedUser} />
                        </div>
                    </div>

                    {/* 🔹 RIGHT SIDEBAR */}
                    <div className="w-full lg:w-[350px] space-y-4">

                        {/* User Details */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border">
                            <UserDetails user={selectedUser} />
                        </div>

                        {/* Add User */}
                        <div className="bg-white p-4 rounded-2xl shadow-sm border">
                            <AddUserForm addUser={addUser} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDirectory;