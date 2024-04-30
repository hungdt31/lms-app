"use client";
import nav from "@/helpers/AdminNav";
import * as React from "react";
import { ArrowLeftRight } from "lucide-react";
import ToggleTheme from "../toggle-theme";
import { Nav } from "./Nav";
import { Button } from "../ui/button";
import { useWindowWidth } from "@react-hook/window-size";
import UserQuery from "@/hooks/user";
type Props = {};
export default function SideNavbar({}: Props) {
  const userData = UserQuery();
  const [user, setUser] = React.useState<any>(null);
  React.useEffect(() => {
    if (userData) {
      setUser(userData?.data?.data);
    }
  }, [userData?.data]);
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
  return (
    <div>
      <div className="flex justify-center flex-col items-center gap-3 mb-3">
        <div className="avatar">
          <div className="w-16 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img src={user?.avatar} />
          </div>
        </div>
        {!isCollapsed && (
          <p className="font-bold">
            {user?.firstname} {user?.lastname}
          </p>
        )}
      </div>
      <div className="absolute top-5 left-2">
        <ToggleTheme />
      </div>
      {!mobileWidth && (
        <Button
          variant={"link"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-5 right-0"
        >
          <ArrowLeftRight />
        </Button>
      )}
      <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={nav} />
    </div>
  );
}
