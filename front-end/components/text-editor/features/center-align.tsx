import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { FaAlignCenter } from "react-icons/fa";
import { ButtonProps} from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const CenterAlignButton = (editor: Editor): ButtonProps => ({
  label: <FaAlignCenter />,
  onClick: () => {
    editor.isActive({ textAlign: 'center' }) ? editor.chain().focus().setTextAlign('left').run() :  editor.chain().focus().setTextAlign('center').run();
  },
  disabled: false,
  variant: editor.isActive({ textAlign: 'center' }) ? 'default' : 'secondary',
});