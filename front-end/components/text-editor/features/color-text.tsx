import { Editor } from "@tiptap/core"; // Import the Editor type from tiptap
import { RiFontColor } from "react-icons/ri";
import { ButtonProps } from "@/components/text-editor/button-props"; // Import the ButtonProps interface from button-props.ts

export const ColorTextButton = (editor: Editor): ButtonProps => ({
  label: <RiFontColor size={24} />,
  onClick: () => {
    editor.isActive("textStyle", { color: "#0984ff" })
      ? editor.chain().focus().unsetColor().run()
      : editor.chain().focus().setColor("#0984ff").run();
  },
  disabled: false,
  variant: editor.isActive("textStyle", { color: "#0984ff" })
    ? "default"
    : "secondary",
});
