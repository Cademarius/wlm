"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react"; 
import { NotificationBing } from "iconsax-react"; 

const NAV_LINKS = [
  { id: "mes-crushs", label: "Mes Crushs", href: "/addcrush" },
  { id: "qui-ma-crush", label: "Qui m'a crush", href: "/matchcrush" },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full max-w-[1576px] h-[80px] mx-auto px-4 sm:px-6 lg:px-12 flex items-center justify-between border-b-2 border-[#FF4F81] lg:h-[120px] md:h-[80px]">

      <Image
        src="/assets/header/computer-logo.png"
        alt="WhoLikeMe Logo"
        width={211}
        height={80}
        className="hidden lg:block cursor-pointer"
      />
      <Image
        src="/assets/header/mobile-logo.png"
        alt="WhoLikeMe Logo"
        width={79}
        height={24}
        className="lg:hidden cursor-pointer"
      />

      <nav className="hidden lg:flex gap-10">
        {NAV_LINKS.map(({ id, label, href }) => (
          <Link key={id} href={href}>
            <span
              className={`text-[24px] font-medium cursor-pointer transition-colors duration-300 ${
                pathname === href ? "text-[#FF4F81]" : "text-white hover:text-[#FF4F81]"
              }`}
            >
              {label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="hidden lg:flex items-center gap-4">
        <button className="p-2 cursor-pointer">
          <NotificationBing size={44} color="white" />
        </button>
        <button
          className="w-12 h-12 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110 cursor-pointer"
          onClick={() => console.log("Open login overlay")}
        >
          <Image src="/assets/header/avatar.png" alt="User Avatar" width={50} height={50} />
        </button>
      </div>

      <button className="lg:hidden">
        <Menu size={24} color="white" />
      </button>
    </header>
  );
};

export default Header;
