export default function AuthBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C1F2A] via-[#2A2D3A] to-[#1C1F2A]"></div>

      <div className="absolute inset-0 bg-gradient-to-tr from-[#F5B301]/10 via-transparent to-[#FFF9E6]/5"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-16 h-16 opacity-10 animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-[#F5B301]"
          >
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>

        <div className="absolute top-32 right-16 w-12 h-12 opacity-8 animate-bounce">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-[#FFF9E6]"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </div>

        <div className="absolute bottom-32 left-20 w-14 h-14 opacity-6 animate-pulse">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-[#F5B301]"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>

        <div className="absolute bottom-20 right-10 w-10 h-10 opacity-7 animate-bounce">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-full h-full text-[#FFF9E6]"
          >
            <path d="M9 11H7v6h2v-6zm4 0h-2v6h2v-6zm4 0h-2v6h2v-6zm2-7H3v2h18V4z" />
          </svg>
        </div>
      </div>

      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F5B301' fill-opacity='0.1'%3E%3Cpath d='M40 40c0-22.091-17.909-40-40-40v40h40z'/%3E%3Cpath d='M40 40c0 22.091 17.909 40 40 40V40H40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="absolute inset-0 opacity-3">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F5B301' fill-opacity='0.05'%3E%3Cpath d='M30 30h30v30H30z'/%3E%3Cpath d='M0 0h30v30H0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[#F5B301] opacity-3 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-[#FFF9E6] opacity-4 rounded-full blur-2xl animate-bounce"></div>
      <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-[#F5B301] opacity-2 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-28 h-28 bg-[#FFF9E6] opacity-3 rounded-full blur-2xl animate-bounce"></div>

      <div className="absolute inset-0 opacity-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M10,20 Q30,40 50,30 T90,50"
            stroke="#F5B301"
            strokeWidth="0.5"
            fill="none"
            strokeDasharray="2,2"
            className="animate-pulse"
          />
          <path
            d="M20,80 Q40,60 60,70 T90,30"
            stroke="#FFF9E6"
            strokeWidth="0.3"
            fill="none"
            strokeDasharray="1,3"
            className="animate-bounce"
          />
        </svg>
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1C1F2A]/20 to-[#1C1F2A]/40"></div>
    </div>
  );
}
