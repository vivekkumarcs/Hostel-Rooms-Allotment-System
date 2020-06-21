import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => (
    <div className="nbg">
        <h1 className="abc">Oops!</h1>
        <h1 className="abc FoF">404</h1>
        <h4 className="abc">Page Not Found</h4>
        <div className="abc">
            <Link to="/">
                <span className="goHomeButton">{"<< "}Go Home</span>
            </Link>
        </div>
    </div>
);

export default NotFoundPage;
