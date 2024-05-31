import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="p-2 md:px-8 flex justify-between items-center bg-[#3F3D56] text-white h-6 text-[0.6rem] truncate">
      <p></p>
      <p>Ⓒ RipeSeed 2024</p>
      <div className="flex gap-1 flex-row h-full">
        <p className="flex items-center">built by</p>
        <Link
          href={"https://ripeseed.io"}
          target="_blank"
          className="flex items-center">
          <Image
            src={"/logo/logo.svg"}
            alt="ripeseed.io"
            width={70}
            height={70}
          />
        </Link>
      </div>
    </div>
  );
};
