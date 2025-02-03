import {
  Button,
  ButtonGroup,
  Card,
  InputGroup,
  Popover,
} from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { CreateFolder, CreateNote, DeleteNote, GetNote, MoveFolder, QueryRoot } from "./persistance";
import { useCurrentNote, useNotes } from "./state/notes";
import { Link, useNavigate, useParams } from "react-router";
import { navigateTo } from "./panel_nav";

export default function Notes() {
  const [noteName, setNoteName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [moveto, setMoveto] = useState("");
  const { notes, trigger, addToPath, path, setNotes, removeFromPath } =
    useNotes();
  const { noteid } = useParams();
  const navigate = useNavigate();
  const { setCurrentNote, setCurrentFolder, currentFolder } = useCurrentNote();

  useEffect(() => {
    if (noteid) {
      const getNote = async () => {
        const resp = await QueryRoot(noteid);
        const data = await resp.json();
        if (data === null) {
          setNotes([]);
        } else {
          setNotes(data);
        }
        const current = await GetNote(noteid);
        const currentData = await current.json();
        if (currentData === null) {
          setCurrentNote(null);
        } else {
          if (currentData.type === "folder") {
            setCurrentFolder(currentData);
          } else {
            setCurrentNote(currentData);
          }
        }

      };

      if (noteid) {
        getNote();
      }
    }
  }, [noteid]);

  return (
    <div className="container notes">
      <h3>Notes</h3>

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

      {notes.filter((note) => note.type === "folder").length > 0 && (
        <div className="mar-top vflex">
          {notes
            .filter((note) => note.type === "folder")
            .map((folder, index) => (
              <Link
                key={index}
                to={`/notes/${folder._id}`}
                onClick={() => {
                  addToPath({ _id: folder._id, name: folder.name })
                  setCurrentFolder(folder)
                } 
                }
              >
                {folder.name}
              </Link>
            ))}
        </div>
      )}

      {notes.filter((note) => note.type === "note").length > 0 && (
        <div className="mar-top-b vflex">
          {notes
            .filter((note) => note.type === "note")
            .map((note, index) => (
              <Link
                key={index}
                to={`/noteeditor/${note._id}`}
                onClick={() => {
                  addToPath({ _id: note._id, name: note.name });
                  setCurrentNote(note);
                  navigateTo("/preview");
                }}
              >
                {note.name}
              </Link>
            ))}
        </div>
      )}

      <div className="mar-top-b vflex">
        <Popover
          content={
            <Card>
              <h4>Create new note</h4>
              <InputGroup
                placeholder="Note Name"
                className="mar-top"
                value={noteName}
                onValueChange={(value: string) => {
                  setNoteName(value);
                }}
              />
              <ButtonGroup className="mar-top">
                <Button
                  intent="primary"
                  onClick={async () => {
                    await CreateNote(noteName, noteid ? noteid : "root");
                    setNoteName("");
                    trigger();
                  }}
                >
                  Create
                </Button>
              </ButtonGroup>
            </Card>
          }
          position="bottom-left"
          minimal
        >
          <a>Create Note</a>
        </Popover>

        <Popover
          content={
            <Card>
              <h4>Create new folder</h4>
              <InputGroup
                placeholder="Folder name"
                className="mar-top"
                value={folderName}
                onValueChange={(value: string) => {
                  setFolderName(value);
                }}
              />
              <ButtonGroup className="mar-top">
                <Button
                  intent="primary"
                  onClick={async () => {
                    await CreateFolder(folderName, noteid ? noteid : "root");
                    setFolderName("");
                    trigger();
                  }}
                >
                  Create
                </Button>
              </ButtonGroup>
            </Card>
          }
          position="bottom-left"
          minimal
        >
          <a>Add Folder</a>
        </Popover>
        {noteid && noteid !== "root" && (
          <>
            <Popover
              content={
                <Card>
                  <h4>Move to ID</h4>
                  <InputGroup
                    placeholder="Folder ID"
                    className="mar-top"
                    value={moveto}
                    onValueChange={(value: string) => {
                      setMoveto(value);
                    }}
                  />
                  <ButtonGroup className="mar-top">
                    <Button intent="primary" onClick={async () => {
                      if (!moveto) return;
                      if (!currentFolder) return;
                      await MoveFolder(currentFolder, moveto);
                      setMoveto("");
                    }}>
                      Move
                    </Button>
                  </ButtonGroup>
                </Card>
              }
              position="bottom-left"
              minimal
            >
              <a>Move</a>
            </Popover>
            <a
              onDoubleClick={async () => {
                await DeleteNote(noteid);
                if (path.length === 1) {
                  navigate("/notes");
                } else {
                  navigate(`/notes/${path[path.length - 2]._id}`);
                  const item = path[path.length - 2];
                  removeFromPath(item);
                }
                trigger();
              }}
            >
              Delete
            </a>
          </>
        )}
      </div>
    </div>
  );
}
