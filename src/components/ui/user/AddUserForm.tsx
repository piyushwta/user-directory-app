import { useState } from "react";
import { userSchema, type UserFormData } from "../../../utils/validators";
import toast from "react-hot-toast";

export const AddUserForm = ({ addUser }: any) => {
    const [form, setForm] = useState<UserFormData>({
        name: "",
        email: "",
        role: "Admin",
        status: "Active",
        language: "",
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof UserFormData, string>>
    >({});

    // ✅ Generic handler (type-safe)
    const handleChange = <K extends keyof UserFormData>(
        field: K,
        value: UserFormData[K]
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));

        const result = userSchema.shape[field].safeParse(value);

        setErrors((prev) => ({
            ...prev,
            [field]: result.success ? "" : result.error.issues[0]?.message,
        }));
    };

    const handleSubmit = () => {
        const result = userSchema.safeParse(form);

        if (!result.success) {
            const err: Partial<Record<keyof UserFormData, string>> = {};

            result.error.issues.forEach((e) => {
                const key = e.path[0] as keyof UserFormData;
                if (key) err[key] = e.message;
            });

            setErrors(err);
            // error toast
            toast.error("Please fix the form errors");
            return;
        }

        addUser(form);

        // success toast
        toast.success("User added successfully!");

        // reset
        setForm({
            name: "",
            email: "",
            role: "Admin",
            status: "Active",
            language: "",
        });

        setErrors({});
    };

    const isValid =
        Object.values(form).every(Boolean) &&
        Object.values(errors).every((e) => !e);

    return (
        <div className="space-y-4">

            {/* Name */}
            <div>
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="border p-2 w-full rounded"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm">{errors.name}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="border p-2 w-full rounded"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email}</p>
                )}
            </div>

            {/* Role */}
            <div>
                <select
                    value={form.role}
                    onChange={(e) =>
                        handleChange("role", e.target.value as UserFormData["role"])
                    }
                    className="border p-2 w-full rounded"
                >
                    <option value="Admin">Admin</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                </select>
            </div>

            {/* Status */}
            <div>
                <select
                    value={form.status}
                    onChange={(e) =>
                        handleChange("status", e.target.value as UserFormData["status"])
                    }
                    className="border p-2 w-full rounded"
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            {/* Language */}
            <div>
                <input
                    placeholder="Language"
                    value={form.language}
                    onChange={(e) => handleChange("language", e.target.value)}
                    className="border p-2 w-full rounded"
                />
                {errors.language && (
                    <p className="text-red-500 text-sm">{errors.language}</p>
                )}
            </div>

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!isValid}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 rounded-lg font-medium"
            >
                Add User
            </button>
        </div>
    );
};