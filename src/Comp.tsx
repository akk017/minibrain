import { BrowserRouter, Routes, Route } from "react-router";
import Nav from "./Nav";
import Module from "./Module";
import WorkItems from "./WorkItem";
import Notes from "./Notes";
import NoteEditor from "./NoteEditor";
import Bookmarks from "./Bookmarks";

export default function Comp() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="workitems" element={<WorkItems />} />
        <Route path="module" element={<Module />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notes/:noteid" element={<Notes />} />
        <Route path="noteeditor/:noteid" element={<NoteEditor />} />
        <Route path="bookmarks" element={<Bookmarks />} />
      </Routes>
    </BrowserRouter>
  );
  
}