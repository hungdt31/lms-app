import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { FaQuoteLeft } from "react-icons/fa";
import { ButtonProps, checkVariant } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const BlockquoteButton = (editor: Editor): ButtonProps => ({
  label: <FaQuoteLeft/>,
  onClick: () => editor.chain().focus().toggleBlockquote().run(),
  disabled: false,
  variant: checkVariant(editor, "blockquote")
});