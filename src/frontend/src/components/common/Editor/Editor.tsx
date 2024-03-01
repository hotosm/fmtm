import React, { useState } from 'react';
import { useEditor, EditorContent, FloatingMenu, BubbleMenu } from '@tiptap/react';
import { Toolbar } from '@/components/common/Editor/Toolbar';
import StarterKit from '@tiptap/starter-kit';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Heading from '@tiptap/extension-heading';
import Document from '@tiptap/extension-document';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import './editorStyles.scss';

// define your extension array
const extensions = [
  StarterKit,
  Document,
  Paragraph,
  Text,
  ListItem,
  BulletList,
  OrderedList,
  Heading,
  Link.configure({
    validate: (href) => /^https?:\/\//.test(href),
  }),
  Image.configure({
    inline: true,
  }),
  Youtube,
];

const content = '<p>Hello World!</p>';

const Tiptap = () => {
  const [editorHtmlContent, setEditorHtmlContent] = useState('');

  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      setEditorHtmlContent(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="no-tailwindcss fmtm-remove-all fmtm-border-[1px] fmtm-border-gray-300 fmtm-rounded-md">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
