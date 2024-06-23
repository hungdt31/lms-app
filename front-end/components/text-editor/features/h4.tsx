import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { LuHeading4 } from "react-icons/lu";
import { ButtonProps } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const H4Button = (editor: Editor): ButtonProps => ({
  label: <LuHeading4 size={24}/>,
  onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
  disabled: false,
  variant: editor.isActive('heading', { level: 4 })  ? "default" : "secondary"
});