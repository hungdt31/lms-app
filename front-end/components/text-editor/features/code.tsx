import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { FaCode } from "react-icons/fa";; // Import the FaBold icon from react-icons
import { ButtonProps, checkVariant} from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const CodeButton = (editor: Editor): ButtonProps => ({
  label: <FaCode />,
  onClick: () => editor.chain().focus().toggleCode().run(),
  disabled: !editor.can().chain().focus().toggleCode().run(),
  variant: checkVariant(editor, "code"),
});