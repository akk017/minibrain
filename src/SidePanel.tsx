import { BrowserRouter, Routes, Route, useNavigate} from "react-router";
import { AddWorkItem } from "./WorkItem";
import { setNavigate } from "./panel_nav";
import { NoteEditorPreview } from "./NoteEditor";



export default function SidePanel() {
  const NavigationSetter = () => {
    const navigate = useNavigate();
    setNavigate(navigate);
    return null;
  };

  return (
    <BrowserRouter>
      <NavigationSetter />
      <div className="nav">
        <h3 className="title">SidePanel</h3>
      </div>
      <Routes>
        <Route path="workitems" element={<AddWorkItem />} />
        <Route index path="preview" element={<NoteEditorPreview />} />
      </Routes>
    </BrowserRouter>
  );
  
}