// Backend role → display label. Shared so any component can render a
// human-readable função from the raw ROLE_* value.
export function roleLabel(role) {
    if (role === "ROLE_ADMIN") return "Administrador";
    if (role === "ROLE_USER") return "Usuário";
    return role ?? "—";
}

// Company areas — values must match the backend GroupArea enum exactly.
// Shared so every user-creation form offers the same picklist.
export const GROUPS = [
    { value: "TI", label: "TI" },
    { value: "RH", label: "RH" },
    { value: "MARKETING", label: "Marketing" },
    { value: "FINANCEIRO", label: "Financeiro" },
    { value: "ADMINISTRATIVO", label: "Administrativo" },
    { value: "COMERCIAL", label: "Comercial" },
];
