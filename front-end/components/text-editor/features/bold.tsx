import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { FaBold } from 'react-icons/fa'; // Import the FaBold icon from react-icons
import { ButtonProps, checkVariant } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const BoldButton = (editor: Editor): ButtonProps => ({
  label: <FaBold/>,
  onClick: () => editor.chain().focus().toggleBold().run(),
  disabled: !editor.can().chain().focus().toggleBold().run(),
  variant: checkVariant(editor, "bold")
});