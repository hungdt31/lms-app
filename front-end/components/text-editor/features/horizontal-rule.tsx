import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { MdOutlineHorizontalRule } from "react-icons/md";
import { ButtonProps, checkVariant } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const HorizontalRuleButton = (editor: Editor): ButtonProps => ({
  label: <MdOutlineHorizontalRule />,
  onClick: () => editor.chain().focus().setHorizontalRule().run(),
  disabled: false,
  variant: checkVariant(editor, "horizontalRule")
});