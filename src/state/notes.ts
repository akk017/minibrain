import { useEffect, useState } from "react";
import { atom, useRecoilState } from "recoil";
import { QueryRoot } from "../persistance";

export interface INoteItem {
  name: string;
  type: "folder" | "note";
  parentid: string;
  _id: string;
}

interface IPath {
  _id: string;
  name: string;
}

export const NotesState = atom<INoteItem[]>({
  key: "Notes",
  default: [],
});

type Empty = null;

export interface INote extends INoteItem {
  content: string;
}

export const CurrentNoteState = atom<INote | Empty>({
  key: "CurrentNote",
  default: null,
});

export const CurrentFolderState = atom<INoteItem | null>({
  key: "CurrentFolder",
  default: null,
});

export const Path = atom<IPath[]>({
  key: "Path",
  default: [
    {
      _id: "root",
      name: "root",
    }
  ],
});

function DeleteAfter(array, value) {
  const index = array.indexOf(value);
  return index !== -1 ? array.slice(0, index + 1) : array;
}

export function useNotes() {
    const [count, setCount] = useState(0);
    const [notes, setNotes] = useRecoilState(NotesState);
    const [path, setPath] = useRecoilState(Path);
    const [readerMode, setReaderMode] = useState(false);

    useEffect(() => {
        const getAll = async () => {
            const path = window.location.pathname.split("/");
            let noteid = path[path.length - 1];

            if (noteid === "notes"){
              noteid = "root";
            }
            const resp = await QueryRoot(noteid);
            const data = await resp.json();
            if (data === null) return;
            console.log(data)
            setNotes(data);
        };
        getAll();
    }, [count]);

    const addToPath = (path: IPath) => {
        setPath((m) => [...m, path]);
    }

    const removeFromPath = (path: IPath) => {
        setPath((m) => DeleteAfter(m, path));
    }

    const trigger = () => {
        setCount((count) => count + 1);
    }

    return { trigger, notes, setNotes, addToPath, path, setPath, removeFromPath, readerMode, setReaderMode};
}


export function useCurrentNote() {
  const [currentNote, setCurrentNote] = useRecoilState(CurrentNoteState);
  const [currentFolder, setCurrentFolder] = useRecoilState(CurrentFolderState);
  return { currentNote, setCurrentNote, currentFolder, setCurrentFolder };
}