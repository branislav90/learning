// shared/ui/Avatar.tsx
import { useCurrentUser } from "@/features/auth";
export function Avatar() { const u = useCurrentUser(); return <img src={u.avatarUrl} alt="" />; }
export {};
