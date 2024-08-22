"use client";
// /components/ExportButtons/ExportButtons.jsx

import React from "react";
import { Button, Row, Col } from "reactstrap";

const ExportButtons = () => {
  const handleExportPDF = () => {
    console.log("Exporting to PDF...");
  };

  const handleExportExcel = () => {
    console.log("Exporting to Excel...");
  };

  return (
    <Row className="mb-4 justify-content-end align-items-center">
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