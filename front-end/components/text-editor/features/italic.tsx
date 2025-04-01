import { Editor } from "@tiptap/core"; // Import the Editor type from tiptap
import { FaItalic } from "react-icons/fa"; // Import the FaBold icon from react-icons
import {
  ButtonProps,
  checkVariant,
} from "@/components/text-editor/button-props"; // Import the ButtonProps interface from button-props.ts

export const ItalicButton = (editor: Editor): ButtonProps => ({
  label: <FaItalic />,
  onClick: () => editor.chain().focus().toggleItalic().run(),
  disabled: !editor.can().chain().focus().toggleItalic().run(),
  variant: checkVariant(editor, "italic"),
});
