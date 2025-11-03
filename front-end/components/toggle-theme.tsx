import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Check, Laptop, Moon, Sun, Palette } from "lucide-react";

const THEME_ICON: Record<string, React.ReactNode> = {
  blue: <Palette className="h-4 w-4" />,
  light: <Sun className="h-4 w-4" />,
  dark: <Moon className="h-4 w-4" />,
  system: <Laptop className="h-4 w-4" />,
};

export default function ToggleTheme() {
  const { setTheme, themes, resolvedTheme } = useTheme();
  const items = useMemo(() => {
    const defaults = ["light", "dark", "system"];
    // Ưu tiên thứ tự chuẩn, fallback sang danh sách từ provider nếu khác
    return (themes && themes.length ? themes : defaults).filter(Boolean);
  }, [themes]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full transition-all hover:shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2"
          aria-label="Toggle theme"
       >
          <SunIcon className="h-[1.1rem] w-[1.1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <MoonIcon className="absolute h-[1.1rem] w-[1.1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        <DropdownMenuLabel>Giao diện</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {items.map((theme) => {
          const isActive = resolvedTheme === theme || (theme === "system" && !resolvedTheme);
          return (
            <DropdownMenuItem
              key={theme}
              onClick={() => setTheme(theme)}
              role="menuitemradio"
              aria-checked={isActive}
              className="flex items-center gap-2"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center">
                {THEME_ICON[theme] ?? THEME_ICON.system}
              </span>
              <span className="capitalize flex-1">{theme}</span>
              {isActive && <Check className="h-4 w-4 opacity-80" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
