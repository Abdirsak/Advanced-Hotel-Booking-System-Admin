"use client";
// /components/ExportButtons/ExportButtons.jsx

import React from "react";
import { Button, Input, Row, Col } from "reactstrap";

const ExportButtons = ({ onSearch }) => {
  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
  };

  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  return (
    <Row className="mb-4 justify-content-end align-items-center">
      <Col md={3}>
        <Input
          type="text"
          placeholder="Search..."
          onChange={handleSearchChange}
          style={{ width: '100%' }}
        />
      </Col>
      <Col md={2}>
        <Button color="danger" onClick={handleExportPDF} className="w-100">
          Save as PDF
        </Button>
      </Col>
      <Col md={2}>
        <Button color="success" onClick={handleExportExcel} className="w-100">
          Save as Excel
        </Button>
      </Col>
    </Row>
  );
};

export default ExportButtons;
