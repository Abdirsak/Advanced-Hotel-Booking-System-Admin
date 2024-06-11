import { Col, Input, Row } from "reactstrap";

const TableHeader = ({
  searchTerm,
  rowsPerPage,
  handleFilter,
  handlePerPage,
  data = [],
}) => {
  return (
    <div className="invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-3">
      <Row>
        <Col xl="6" className="d-flex justify-content-start p-0">
          <div className="d-flex align-items-center">
            <select
              className="form-select mx-50"
              type="select"
              id="rows-per-page"
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: "7rem", height: "38px", marginRight: "10px" }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <label htmlFor="rows-per-page ms-3"> Entries per page</label>
          </div>
        </Col>
        <Col
          xl="6"
          className="d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1"
        >
          <div className="d-flex align-items-center mb-sm-0 mb-1 me-1">
            <label className="mb-0" htmlFor="search-invoice me-6">
              Search:
            </label>
            <input
              className="form-control "
              style={{ width: "15rem", height: "38px", marginRight: "10px" }}
              type="text"
              value={searchTerm}
              onChange={handleFilter}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default TableHeader;
