import { UserCard } from "./UserCard";

export const UserList = ({ users, onSelect }: any) => {
    return (
        <div className="grid gap-4">
            {users.map((u: any) => (
                <UserCard key={u.id} user={u} onSelect={onSelect} />
            ))}
        </div>
    );
};