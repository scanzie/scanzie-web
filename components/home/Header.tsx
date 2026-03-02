import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <div className="bg-background border-b border-gray-300/50 fixed w-full top-0 left-0 z-50">
      <div className="app-container flex justify-between items-center h-[72px]">
        <div className="flex items-center gap-2">
          <Image src="/favicon.png" alt="Logo" height={25} width={25} />
          <h2 className="font-bold text-xl">Scanzie</h2>
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://github.com/scanzie" target="_blank">
            Github
          </Link>
          <Link href="/login">
            <Button>Get started</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
