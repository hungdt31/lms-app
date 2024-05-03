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
  UserRoundCheck,
  Contact
} from "lucide-react";

const nav : any = [
  {
    title: "Dashboard",
    // label: "128",
    icon: Send,
    variant: "default",
    href: "/admin",
  },
  {
    title: "User",
    // label: "9",
    icon: Contact,
    variant: "ghost",
    href: "/admin/users",
  },
  {
    title: "Course",
    // label: "",
    icon: Inbox,
    variant: "ghost",
    href: "/admin/courses",
  },
  {
    title: "My account",
    // label: "",
    icon: UserRoundCheck,
    variant: "ghost",
    href: "/admin/account",
  },
]
export default nav