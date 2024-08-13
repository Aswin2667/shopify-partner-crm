import "./404page.css";
import pagenotfound from "../../assets/gif/PageNotFound.gif";
const PageNotFound = () => {
  return (
    <div className="w-screen h-screen ">
      <div className="container">
        <div className="gif">
          <img src={pagenotfound} alt="gif_ing" />
        </div>
        <div className="content">
          <h1 className="main-heading"> ERROR 404 - This page is gone.</h1>
          <p>
            ...maybe the page you're looking for is not found or never existed.
          </p>
          <a href="/" target="blank">
            <button className="button">
              Back to home <i className="far fa-hand-point-right"></i>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};
export default PageNotFound;