import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { RiListOrdered2 } from "react-icons/ri";
import { ButtonProps, checkVariant } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const OrderListButton = (editor: Editor): ButtonProps => ({
  label: <RiListOrdered2 />,
  onClick: () => editor.chain().focus().toggleOrderedList().run(),
  disabled: false,
  variant: checkVariant(editor, "orderedList"),
});