import React from "react";
import { HiOutlineExternalLink } from "react-icons/hi";

type Props = {
  children?: React.ReactNode;
  title: string;
};

const LinkButton: React.FC<Props> = ({ title }: Props) => {
  return (
    <button
      className="bg-[#2b62f0] text-white text-sm rounded-full ml-auto 
        px-3 py-1 font-semibold hover:bg-[#3062e0] flex items-center gap-2"
    >
      <span>{title}</span>
      <HiOutlineExternalLink size={16} />
    </button>
  );
};

export default LinkButton;
