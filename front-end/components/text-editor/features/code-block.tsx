import { Editor } from "@tiptap/core"; // Import the Editor type from tiptap
import { FaFileCode } from "react-icons/fa";
import {
  ButtonProps,
  checkVariant,
} from "@/components/text-editor/button-props"; // Import the ButtonProps interface from button-props.ts

export const CodeBlockButton = (editor: Editor): ButtonProps => ({
  label: <FaFileCode />,
  onClick: () => editor.chain().focus().toggleCodeBlock().run(),
  disabled: false,
  variant: checkVariant(editor, "codeBlock"),
});
