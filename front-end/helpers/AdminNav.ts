import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
  ArrowLeftRight,
} from "lucide-react";

const nav : any = [
  {
    title: "Dashboard",
    // label: "128",
    icon: Inbox,
    variant: "default",
    href: "/admin",
  },
  {
    title: "User",
    // label: "9",
    icon: File,
    variant: "ghost",
    href: "/admin/users",
  },
  {
    title: "Course",
    // label: "",
    icon: Send,
    variant: "ghost",
    href: "/admin/courses",
  },
  {
    title: "Settings",
    // label: "23",
    icon: ArchiveX,
    variant: "ghost",
    href: "/admin/settings",
  },
  {
    title: "Trash",
    // label: "",
    icon: Trash2,
    variant: "ghost",
    href: "/admin/trash",
  },
]
export default nav