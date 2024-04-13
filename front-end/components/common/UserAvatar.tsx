import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface AvatarProps {
  data: {
    avatar?: string;
  };
}

const UserAvatar: React.FC<AvatarProps> = ({ data }) => (
  <Avatar>
    <AvatarImage src={data?.avatar} alt="@shadcn" />
    <AvatarFallback>
      <svg
        className="absolute w-12 h-12 text-gray-400 -left-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </AvatarFallback>
  </Avatar>
);

export default UserAvatar;
