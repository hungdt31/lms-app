import { Editor } from "@tiptap/core";
export interface ButtonProps {
  label: JSX.Element;
  onClick: () => void;
  disabled: boolean;
  variant: "default" | "secondary";
}
export const checkVariant = (editor: Editor, vr: string) => {
  return editor.isActive(vr) ? "default" : "secondary";
};
