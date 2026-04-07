export const FilterPanel = ({ setRole, setStatus }: any) => {
    return (
        <div className="flex gap-4">
            <select onChange={(e) => setRole(e.target.value)} className="border p-2">
                <option value="">All Roles</option>
                <option>Admin</option>
                <option>Editor</option>
                <option>Viewer</option>
            </select>

            <select onChange={(e) => setStatus(e.target.value)} className="border p-2">
                <option value="">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
            </select>
        </div>
    );
};