import { Editor } from "@tiptap/core"; // Import the Editor type from tiptap
import { LuHeading3 } from "react-icons/lu";
import { ButtonProps } from "@/components/text-editor/button-props"; // Import the ButtonProps interface from button-props.ts

export const H3Button = (editor: Editor): ButtonProps => ({
  label: <LuHeading3 size={24} />,
  onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  disabled: false,
  variant: editor.isActive("heading", { level: 3 }) ? "default" : "secondary",
});
