import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { useRef, useCallback } from "react";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ListOrdered,
  List,
  Quote,
  Undo,
  Redo,
  Minus,
  ImagePlus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Strikethrough,
  CheckSquare,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

type Props = {
  content: string;
  onChange: (html: string) => void;
};

export default function TiptapEditor({ content, onChange }: Props) {
  const editorRef = useRef<Editor | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        horizontalRule: false,
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3, 4, 5, 6] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      HorizontalRule,
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      TaskList,
      TaskItem,
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none outline-none min-h-[150px]",
      },
    },
    onCreate: ({ editor }) => {
      editorRef.current = editor;
      editor.commands.setContent(content);
      setTimeout(() => editor.commands.focus("end"), 0);
    },
  });

  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  if (!editor) return null;

  const executeCommand = (cmd: () => void) => {
    editor.commands.focus();
    cmd();
    setTimeout(() => editor.commands.focus(), 0);
  };

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        executeCommand(onClick);
      }}
      className={`p-2 rounded ${
        isActive ? "bg-gray-300" : "hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <div
          className="border rounded-md"
          onMouseDown={() => {
            if (editor && !editor.isFocused) {
              editor.commands.focus();
            }
          }}
        >
          <div className="flex flex-wrap items-center gap-2 border-b bg-gray-100 p-2">
            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  isActive={editor.isActive("bold")}
                >
                  <Bold size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Bold</p>{" "}
                <span className="text-[12px] text-gray-500">Ctrl + B</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  isActive={editor.isActive("italic")}
                >
                  <Italic size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Italic</p>
                <span className="text-[12px] text-gray-500">Ctrl + I</span>
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 1 })}
                >
                  <Heading1 size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Heading 1</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Alt + 1
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 2 })}
                >
                  <Heading2 size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Heading 2</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Alt + 2
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 3 })}
                >
                  <Heading3 size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Heading 3</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Alt + 3
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 4 })}
                >
                  <Heading4 size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Heading 4</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Alt + 4
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 5 })}
                >
                  <Heading5 size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Heading 5</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Alt + 5
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                  }
                  isActive={editor.isActive("heading", { level: 6 })}
                >
                  <Heading6 size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Heading 6</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Alt + 6
                </span>
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  isActive={editor.isActive({ textAlign: "left" })}
                >
                  <AlignLeft size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Align Left</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + L
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  isActive={editor.isActive({ textAlign: "center" })}
                >
                  <AlignCenter size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Align Center</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + E
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  isActive={editor.isActive({ textAlign: "right" })}
                >
                  <AlignRight size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Align Right</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + R
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  isActive={editor.isActive({ textAlign: "justify" })}
                >
                  <AlignJustify size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Justify</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + J
                </span>
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  isActive={editor.isActive("orderedList")}
                >
                  <ListOrdered size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Ordered List</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + 7
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  isActive={editor.isActive("bulletList")}
                >
                  <List size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Bullet List</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + 8
                </span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  isActive={editor.isActive("taskList")}
                >
                  <CheckSquare size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Task List</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + 9
                </span>
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                  }
                >
                  <Minus size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Horizontal Rule</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  isActive={editor.isActive("blockquote")}
                >
                  <Quote size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Blockquote</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleStrike().run()}
                  isActive={editor.isActive("strike")}
                >
                  <Strikethrough size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Strikethrough</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + S
                </span>
              </TooltipContent>
            </Tooltip>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton onClick={addImage}>
                  <ImagePlus size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Add Image</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                >
                  <Undo size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent className="flex flex-col text-center">
                <p>Undo</p>
                <span className="text-[12px] text-gray-500">Ctrl + Z</span>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                >
                  <Redo size={16} />
                </ToolbarButton>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
              <TooltipContent className="flex flex-col text-center">
                <p>Redo</p>
                <span className="text-[12px] text-gray-500">
                  Ctrl + Shift + Z
                </span>
              </TooltipContent>
            </Tooltip>
          </div>

          <style>{`
        .ProseMirror {
          min-height: 150px;
          outline: none;
          padding: 1rem;
        }
        .ProseMirror h1 {
          font-size: 1.75rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.2;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          line-height: 1.25;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h4 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h5 {
          font-size: 1rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror h6 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e2e8f0;
          padding-left: 1rem;
          font-style: italic;
          margin: 1rem 0;
          color: #4a5568;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e2e8f0;
          margin: 1rem 0;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
        }
        .ProseMirror .tiptap-image {
          display: block;
          margin: 1rem 0;
        }
        .ProseMirror ul[data-type="taskList"] {
          list-style: none;
          padding: 0;
          margin: 0.5rem 0;
        }
        .ProseMirror ul[data-type="taskList"] li {
          display: flex;
          align-items: center;
          margin: 0.5rem 0;
          gap: 0.5rem;
        }
        .ProseMirror ul[data-type="taskList"] li > label {
          flex: 0 0 auto;
          margin-right: 0.5rem;
          user-select: none;
          display: flex;
          align-items: center;
        }
        .ProseMirror ul[data-type="taskList"] li > div {
          flex: 1 1 auto;
        }
        .ProseMirror ul[data-type="taskList"] li > label input[type="checkbox"] {
          cursor: pointer;
          margin: 0;
        }
        .ProseMirror ul[data-type="taskList"] li[data-checked="true"] {
          text-decoration: line-through;
          color: #6b7280;
        }
        .ProseMirror s {
          text-decoration: line-through;
        }
      `}</style>

          <EditorContent
            editor={editor}
            className="prose prose-sm max-w-none"
            placeholder="Start writing..."
          />
        </div>
      </Tooltip>
    </TooltipProvider>
  );
}
