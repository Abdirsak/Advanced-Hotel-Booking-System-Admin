"use client";
// /components/DateFilter/DateFilter.jsx

import React, { useState } from "react";
import { Button, Input, Row, Col } from "reactstrap";

const DateFilter = ({ onFilter }) => {
  const [fromDate, setFromDate] = useState("2024-08-01");
  const [toDate, setToDate] = useState("2024-08-30");

  const handleFilter = () => {
    onFilter(fromDate, toDate);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <Row>
        <Col md={5}>
          <label>From Date:</label>
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </Col>
        <Col md={5}>
          <label>To Date:</label>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button color="primary" onClick={handleFilter} className="w-100">
            Filter
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default DateFilter;