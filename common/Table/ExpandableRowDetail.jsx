const ExpandableRowDetail = ({ data }) => {
  return (
    <div className="expandable-row-detail">
      <ul className="list-group">
        {Object.entries(data).map(([key, value]) => (
          <li key={key} className="list-group-item">
            <strong className="fw-bold">{key}:</strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpandableRowDetail;
