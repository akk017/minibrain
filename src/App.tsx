import "./index.css";

import 'highlight.js/styles/github.css';
import Comp from "./Comp";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./SidePanel";

function App() {
  return (
    <div className="main">
      <PanelGroup direction="horizontal" className="panel-group">
        <Panel className="panel-1" defaultSize={70}>
          <Comp />
        </Panel>
        <PanelResizeHandle />
    
        <Panel defaultSize={30} minSize={30} maxSize={100} className="panel-1">
          <SidePanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
