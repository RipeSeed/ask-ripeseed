import Link from "next/link";
import { SquareArrowOutUpRight } from 'lucide-react';

interface HyperlinkProps {
  href: string;
  icon: JSX.Element;
  text: string;
}

const Hyperlink: React.FC<HyperlinkProps> = ({ href, icon, text }) => {
  return (
    <Link
      href={href}
      target="_blank"
      className="group flex items-center justify-between list-none gap-4"
    >
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-lg font-medium text-black opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
          {text}
        </span>
      </div>
      <span className="opacity-50 transition duration-300 group-hover:opacity-100 dark:text-[#D1D1D1]">
        <SquareArrowOutUpRight size={13} strokeWidth={1.5} />
      </span>
    </Link>
  );
};

export default Hyperlink;
