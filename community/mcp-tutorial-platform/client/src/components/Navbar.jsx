import { Link } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    return (
        <nav className="navbar">
            <div className="container">
                <div className="navbar-content">
                    <Link to="/" className="navbar-logo">
                        <span className="logo-icon">⚡</span>
                        <span className="logo-text">
                            Lingo<span className="gradient-text">.dev</span> MCP
                        </span>
                    </Link>

                    <div className="navbar-links">
                        <Link to="/tutorials" className="nav-link">
                            Tutorials
                        </Link>
                        <Link to="/playground" className="nav-link">
                            Playground
                        </Link>
                        <a
                            href="https://lingo.dev/en/mcp"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="nav-link"
                        >
                            Docs ↗
                        </a>
                        <a
                            href="https://github.com/lingodotdev/lingo.dev"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary btn-sm"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
