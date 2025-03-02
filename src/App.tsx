import "./index.css";
import Comp from "./Comp";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import SidePanel from "./SidePanel";

function App() {
  return (
    <div className="main">
      <PanelGroup direction="horizontal" className="panel-group">
        <Panel className="panel-1" minSize={30}>
          <Comp />
        </Panel>
        <PanelResizeHandle />
    
        <Panel defaultSize={40} minSize={30} className="panel-1">
          <SidePanel />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default App;
