import * as comps from "@blueprintjs/core";
import { atom, useRecoilState } from "recoil";
import Masonry from "react-responsive-masonry";

export default function Database() {
  return (
    <div className="container db">
      <h3>Database</h3>
      <div className="hflex mar-top gap-10">
        <comps.Button text="Add Item" intent="primary" small icon="plus" />
      </div>

      <Masonry columnsCount={2} sequential className="db-grid">
        <div className="db-grid-item">
          <img src="http://localhost:8095/SCR-20250417-hecr.png" />
          <h3>Mono</h3>

          <div className="db-tags">
            <comps.Tag intent="success">Font</comps.Tag>
            <comps.Tag intent="success">Design</comps.Tag>
            <comps.Tag intent="success">Landing Page</comps.Tag>
            <comps.Tag intent="success">Font</comps.Tag>
            <comps.Tag intent="success">Design</comps.Tag>
          </div>
          <a></a>
        </div>
        <div className="db-grid-item">
          <img src="http://localhost:8095/SCR-20250417-hecr.png" />
          <h3>Mono</h3>

          <div className="db-tags">
            <comps.Tag intent="success">Font</comps.Tag>
            <comps.Tag intent="success">Design</comps.Tag>
            <comps.Tag intent="success">Landing Page</comps.Tag>
            <comps.Tag intent="success">Font</comps.Tag>
            <comps.Tag intent="success">Design</comps.Tag>
          </div>
          <a></a>
        </div>
        <div className="db-grid-item">
          <img src="http://localhost:8095/SCR-20250417-hecr.png" />
          <h3>Mono</h3>

          <div className="db-tags">
            <comps.Tag intent="success">Font</comps.Tag>
            <comps.Tag intent="success">Design</comps.Tag>
            <comps.Tag intent="success">Landing Page</comps.Tag>
            <comps.Tag intent="success">Font</comps.Tag>
            <comps.Tag intent="success">Design</comps.Tag>
          </div>
          <a></a>
        </div>
      </Masonry>
    </div>
  );
}
