// Backend role → display label. Shared so any component can render a
// human-readable função from the raw ROLE_* value.
export function roleLabel(role) {
    if (role === "ROLE_ADMIN") return "Administrador";
    if (role === "ROLE_USER") return "Usuário";
    return role ?? "—";
}
