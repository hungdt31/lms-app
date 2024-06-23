import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { FaList } from "react-icons/fa";
import { ButtonProps, checkVariant } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const ButtletListButton = (editor: Editor): ButtonProps => ({
  label: <FaList />,
  onClick: () => editor.chain().focus().toggleBulletList().run(),
  disabled: false,
  variant: checkVariant(editor, "bulletList"),
});