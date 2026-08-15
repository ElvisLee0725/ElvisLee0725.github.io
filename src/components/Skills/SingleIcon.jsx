function SingleIcon({ data: { devicon, title } }) {
  return (
    <div className="col-6 tech-icon">
      <i className={`${devicon} colored`}></i>
      <h6>{title}</h6>
    </div>
  );
}

export default SingleIcon;
