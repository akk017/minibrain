import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { GetNote, UpdateNote } from "./persistance";
import { useCurrentNote, useNotes } from "./state/notes";
import Markdown from "react-markdown";
import { BubbleMenu, useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import { all, createLowlight } from "lowlight";

import * as comps from "@blueprintjs/core";

const lowlight = createLowlight(all);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("python", python);

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

const extensions = [
  StarterKit.configure({
    bold: {
      HTMLAttributes: {
        class: "node-paragraph-bold",
      },
    },
    italic: {
      HTMLAttributes: {
        class: "node-paragraph-italic",
      },
    },
    strike: {
      HTMLAttributes: {
        class: "node-paragraph-strike",
      },
    },
  }),
  CodeBlockLowlight.configure({
    lowlight,
  }),
];

export default function NoteEditor() {
  const { noteid } = useParams();
  const { currentNote, setCurrentNote } = useCurrentNote();
  const { path, removeFromPath } = useNotes();

  useEffect(() => {
    const getNote = async (id: string) => {
      const resp = await GetNote(id);
      const data = await resp.json();
      if (data === null) {
        setCurrentNote(null);
      }
      setCurrentNote(data);
    };

    if (noteid && currentNote === null) {
      getNote(noteid);
    }
  });

  // const content = currentNote?.content || "<p>Hello World!</p>";
  const editor = useEditor({
    extensions,
    content: "Loading..",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (!currentNote) return;
      UpdateNote(currentNote?._id, { ...currentNote, content: content });
    },
  });

  useEffect(() => {
    if (editor && currentNote?.content) {
      editor.commands.setContent(currentNote.content);
    }
  }, [editor, currentNote]);

  if (!currentNote) {
    return (
      <div className="container">
        <h3>Note Editor</h3>
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div className="container notes">
      <div className="hflex mar-top">
        {path.map((p, index) => (
          <span key={"gg-" + p._id}>
            <Link to={`/notes/${p._id}`} onClick={() => removeFromPath(p)}>
              {p.name}
            </Link>
            <p style={{ paddingLeft: "10px", paddingRight: "10px" }}>
              {index === path.length - 1 ? "" : " / "}
            </p>
          </span>
        ))}
      </div>
      <h3 className="mar-top">{currentNote.name}</h3>
      <div>
        <EditorContent editor={editor} className="editor" />
        <BubbleMenu editor={editor}>
          <comps.ButtonGroup>
            <comps.Button
              icon="bold"
              intent={editor?.isActive("bold") ? "primary" : "none"}
              onClick={() => editor?.chain().focus().toggleBold().run()}
            />
            <comps.Button
              icon="strikethrough"
              intent={editor?.isActive("strike") ? "primary" : "none"}
              onClick={() => editor?.chain().focus().toggleStrike().run()}
            />
          </comps.ButtonGroup>
        </BubbleMenu>
      </div>
    </div>
  );
}

export function NoteEditorPreview() {
  const { currentNote } = useCurrentNote();

  if (!currentNote) {
    return (
      <div className="container">
        <h3>Note Editor</h3>
        <p>Note not found</p>
      </div>
    );
  }

  return (
    <div className="container notes">
      <h2>{currentNote.name}</h2>
      <Markdown
        className="rmd"
        components={{
          code(props) {
            const { children, className, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, "")}
                language={match[1]}
                style={oneLight}
              />
            ) : (
              <code {...rest} className="inline">
                {children}
              </code>
            );
          },
          p: (m) => {
            console.log("para", m);
            if (
              typeof m.children === "string" &&
              m.children.startsWith("#center")
            ) {
              return <h1 className="center">{m.children.substring(7)}</h1>;
            }
            if (
              typeof m.children === "string" &&
              m.children.startsWith("##center")
            ) {
              return <h2 className="center">{m.children.substring(8)}</h2>;
            }
            if (
              typeof m.children === "string" &&
              m.children.startsWith("###center")
            ) {
              return <h3 className="center">{m.children.substring(9)}</h3>;
            }
            if (
              typeof m.children === "string" &&
              m.children.startsWith("####center")
            ) {
              return <h4 className="center">{m.children.substring(10)}</h4>;
            }
            if (
              typeof m.children === "string" &&
              m.children.startsWith("#####center")
            ) {
              return <h5 className="center">{m.children.substring(11)}</h5>;
            }
            if (
              typeof m.children === "string" &&
              m.children.startsWith("######center")
            ) {
              return <h6 className="center">{m.children.substring(12)}</h6>;
            }
            return <p className="md">{m.children}</p>;
          },
        }}
      >
        {currentNote.content}
      </Markdown>
    </div>
  );
}
