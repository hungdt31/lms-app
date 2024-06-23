import { Editor } from '@tiptap/core'; // Import the Editor type from tiptap
import { FaImage } from "react-icons/fa";
import Image from '@tiptap/extension-image'
import { ButtonProps } from '@/components/text-editor/button-props'; // Import the ButtonProps interface from button-props.ts

export const ImageUrlButton = (editor: Editor): ButtonProps => ({
  label: <FaImage />,
  onClick: () => {
    const url = window.prompt('URL')
    editor.extensionManager.extensions.push(Image)
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  },
  disabled: false,
  variant: "secondary"
});