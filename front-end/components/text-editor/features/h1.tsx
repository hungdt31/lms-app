import { Editor } from "@tiptap/core"; // Import the Editor type from tiptap
import { LuHeading1 } from "react-icons/lu";
import { ButtonProps } from "@/components/text-editor/button-props"; // Import the ButtonProps interface from button-props.ts

export const H1Button = (editor: Editor): ButtonProps => ({
  label: <LuHeading1 size={24} />,
  onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  disabled: false,
  variant: editor.isActive("heading", { level: 1 }) ? "default" : "secondary",
});
