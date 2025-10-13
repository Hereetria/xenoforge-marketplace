interface UserAvatarProps {
  name?: string | null;
  email: string;
}

export default function UserAvatar({ name, email }: UserAvatarProps) {
  const initial = name?.charAt(0) || email.charAt(0);

  return (
    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#F5B301] rounded-full flex items-center justify-center flex-shrink-0">
      <span className="text-[#1C1F2A] font-semibold text-xs sm:text-sm">
        {initial.toUpperCase()}
      </span>
    </div>
  );
}
