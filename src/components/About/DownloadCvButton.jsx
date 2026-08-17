function DownloadCvButton() {
  return (
    <div className="text-center mt-4">
      <a
        className="btn btn--download"
        href="https://drive.google.com/file/d/1zbxJVNfewrog37zcP6B5XWIJ9ZG0vXWu/view?usp=drive_link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fas fa-file-download"></i>&nbsp;Download CV
      </a>
    </div>
  );
}

export default DownloadCvButton;
