import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { GetNote, UpdateNote } from "./persistance";
import { EditableText } from "@blueprintjs/core";
import { useCurrentNote, useNotes } from "./state/notes";
import Markdown from "react-markdown";
import { debounce } from "throttle-debounce";
import { navigateTo } from "./panel_nav";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {oneLight} from 'react-syntax-highlighter/dist/esm/styles/prism'

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
      navigateTo("/preview");
    };

    if (noteid && currentNote === null) {
      getNote(noteid);
    }
  }, []);

  console.log("NoteEditor", currentNote);

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
          <>
            <Link to={`/notes/${p._id}`} onClick={() => removeFromPath(p)}>
              {p.name}
            </Link>
            <p style={{ paddingLeft: "10px", paddingRight: "10px" }}>
              {index === path.length - 1 ? "" : " / "}
            </p>
          </>
        ))}
      </div>
      <h3 className="mar-top">{currentNote.name}</h3>
      <EditableText
        multiline
        minLines={30}
        maxLines={1000000}
        className="mar-top note-editor"
        placeholder="Start typing..."
        value={currentNote.content}
        onChange={async (value) => {
          if (!value) {
            // @ts-expect-error: value is not null
            setCurrentNote((note) => {
              return { ...note, content: "" };
            });
            return;
          }
          // @ts-expect-error: value is not null
          setCurrentNote((note) => {
            return { ...note, content: value };
          });

          const debouncedSync = debounce(300, async () => {
            await UpdateNote(currentNote._id, currentNote);
          });
          debouncedSync();
        }}
        onConfirm={async () => {
          await UpdateNote(currentNote._id, currentNote);
        }}
      />
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
            const {children, className, ...rest} = props
            const match = /language-(\w+)/.exec(className || '')
            return match ? (
              <SyntaxHighlighter
                {...rest}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={oneLight}
              />
            ) : (
              <code {...rest} className="inline">
                {children}
              </code>
            )
          },
          p: (m) => {
            console.log("para", m)
            if (typeof m.children === "string" && m.children.startsWith("#center")) {
              return <h1 className="center">{m.children.substring(7)}</h1>;
            }
            if (typeof m.children === "string" && m.children.startsWith("##center")) {
              return <h2 className="center">{m.children.substring(8)}</h2>;
            }
            if (typeof m.children === "string" && m.children.startsWith("###center")) {
              return <h3 className="center">{m.children.substring(9)}</h3>;
            }
            if (typeof m.children === "string" && m.children.startsWith("####center")) {
              return <h4 className="center">{m.children.substring(10)}</h4>;
            }
            if (typeof m.children === "string" && m.children.startsWith("#####center")) {
              return <h5 className="center">{m.children.substring(11)}</h5>;
            }
            if (typeof m.children === "string" && m.children.startsWith("######center")) {
              return <h6 className="center">{m.children.substring(12)}</h6>;
            }
            return <p className="md">{m.children}</p>;
          },
        }}
      >{currentNote.content}</Markdown>
    </div>
  );
}
