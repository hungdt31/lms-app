"use client";
import nav from "@/helpers/AdminNav";
import * as React from "react";
import { ArrowLeftRight } from "lucide-react";

import { Nav } from "./Nav";
import { Button } from "../ui/button";
import { useWindowWidth } from "@react-hook/window-size";

type Props = {};
export default function SideNavbar({}: Props) {
  const onlyWidth = useWindowWidth();
  const mobileWidth = onlyWidth < 768;
  const [isCollapsed, setIsCollapsed] = React.useState<boolean>(true);
  return (
    <div>
      {!mobileWidth && (
        <Button
          variant={"link"}
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute top-5"
        >
          <ArrowLeftRight />
        </Button>
      )}
      <Nav isCollapsed={mobileWidth ? true : isCollapsed} links={nav} />
    </div>
  );
}
