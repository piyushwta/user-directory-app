export const UserDetails = ({ user }: any) => {
    if (!user) return <div>Select a user</div>;

    return (
        <div className="p-4 border rounded">
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Status: {user.status}</p>
            <p>Language: {user.language}</p>
        </div>
    );
};