import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <div className="p-2 md:px-8 flex justify-between items-center bg-[#3F3D56] text-white h-6 text-xs truncate">
      <p></p>
      <p>Ⓒ RipeSeed 2024</p>
      <div className="flex gap-1">
        <p className="flex items-end">Built by </p>
        <Link href={"https://ripeseed.io"} target="_blank">
          <Image
            src={"/logo/logo.svg"}
            alt="ripeseed.io"
            width={100}
            height={100}
          />
        </Link>
      </div>
    </div>
  );
};
