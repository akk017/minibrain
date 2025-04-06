import { Link } from "react-router";


export default function Nav() {
    return (
        <div className="nav">
            <h3 className="title">MiniBrain</h3>
            <Link className="nav-link" to="/workitems">Work Items</Link>
            <Link className="nav-link" to="/notes">Notes</Link>
            <Link className="nav-link" to="/bookmarks">Bookmarks</Link>
            <Link className="nav-link" to="/tracker">Tracker</Link>
            <Link className="nav-link" to="/accounts">Accounts</Link>
        </div>
    )
}