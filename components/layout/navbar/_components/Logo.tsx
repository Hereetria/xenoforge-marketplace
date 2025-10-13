import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link
      href="/"
      className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-shrink-0"
    >
      <div className="w-8 h-8 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
        <Image
          src="/xenoforge-logo.png"
          alt="XenoForge Logo"
          width={48}
          height={48}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="text-white font-bold text-base sm:text-lg lg:text-xl truncate hidden xs:block">
        XenoForge
      </span>
    </Link>
  );
}
