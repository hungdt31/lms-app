import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { LuHeading2 } from "react-icons/lu";
import { ButtonProps} from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const H2Button = (editor: Editor): ButtonProps => ({
  label: <LuHeading2 size={24}/>,
  onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  disabled: false,
  variant: editor.isActive('heading', { level: 2 })  ? "default" : "secondary"
});