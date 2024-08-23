import moment from "moment";
import React from "react";
import { Col, Row, Button, Input } from "reactstrap";

const FilterHeader = ({
  startDate,
  endDate,
  handlefilterChange,
  handleStartDateChange,
  handleEndDateChange,
  handleFilter,
}) => {
  console.log("startDate", startDate);
  return (
    <div className="filter-header w-100 me-1 ms-50 mt-2 mb-3">
      <Row>
        <Col md={4} lg={4} sm={12} className="">
          <label className="mb-0" htmlFor="start-date">
            Start Date
          </label>
          <Input
            type="date"
            id="start-date"
            value={moment(startDate).format("YYYY-MM-DD")}
            onChange={handleStartDateChange}
            // style={{ width: "15rem", height: "38px", marginRight: "10px" }}
          />
        </Col>
        <Col md={4} lg={4} sm={12}>
          <label className="mb-0" htmlFor="end-date">
            End Date
          </label>
          <Input
            type="date"
            id="end-date"
            value={moment(endDate).format("YYYY-MM-DD")}
            onChange={handleEndDateChange}
            // style={{ width: "15rem", height: "38px", marginRight: "10px" }}
          />
        </Col>
        <Col md={2} lg={2} sm={4} className="mt-4">
          <Button
            color="primary"
            style={{ height: "38px" }}
            onClick={handleFilter}
          >
            Filter By Date
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default FilterHeader;
