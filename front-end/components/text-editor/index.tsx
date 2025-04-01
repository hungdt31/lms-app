import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { Button } from "@/components/ui/button";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { Buttons } from "@/components/text-editor/buttons";
import { ButtonProps } from "@/components/text-editor/button-props";

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) {
    return null;
  }
  let buttons: ButtonProps[] = [];
  for (const button of Buttons) {
    buttons.push(button(editor));
  }
  return (
    <div className="control-group">
      <div className="button-group flex gap-3 flex-wrap">
        {buttons.map((e, index) => (
          <Button
            type="button"
            key={index}
            onClick={e.onClick}
            disabled={e.disabled}
            variant={e.variant}
          >
            {e.label}
          </Button>
        ))}
      </div>
      <hr />
    </div>
  );
};
const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  Image.configure({}),
  TextStyle.configure({}),
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
];
const content = `
<h1>
  Lorem Ipsum
</h1>
<blockquote>
  "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."
  "There is no one who loves pain itself, who seeks after it and wants to have it, simply because it is pain..."
</blockquote>
<hr/>
<h2>
What is Lorem Ipsum?
</h2>
<p><strong>Lorem Ipsum</strong> is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
`;
export default function TextEditor({
  onChange,
  defaultContent,
}: {
  onChange: (value: string) => void;
  defaultContent?: any;
}) {
  return (
    <div className="border-border border-2 shadow-lg rounded-lg p-3">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={defaultContent || content}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML());
        }}
        onBeforeCreate={({ editor }) => {
          defaultContent ? onChange(defaultContent) : onChange(content);
        }}
      ></EditorProvider>
    </div>
  );
}
