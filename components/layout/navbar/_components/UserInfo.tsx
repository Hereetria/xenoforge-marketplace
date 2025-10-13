import { Role } from "@/lib/constants/roles";

interface UserInfoProps {
  name?: string | null;
  role: Role;
}

export default function UserInfo({ name, role }: UserInfoProps) {
  return (
    <div className="text-right min-w-0 flex items-center">
      <p className="text-white text-xs sm:text-sm font-medium truncate">
        {name || "User"}
      </p>
    </div>
  );
}
