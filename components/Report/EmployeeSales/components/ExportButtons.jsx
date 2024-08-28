"use client";
// /components/ExportButtons/ExportButtons.jsx

import React from "react";
import { Button, Input, Row, Col } from "reactstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import config from "../../../../config";
import * as XLSX from 'xlsx';

const ExportButtons = ({ onSearch, columns, tableData }) => {
  const handleExportPDF = () => {
    const doc = new jsPDF();

    const { companyLogoBase64, companyName } = config;
    doc.addImage(companyLogoBase64, "PNG", 10, 10, 30, 30);
    doc.setFontSize(18);
    doc.text(companyName, doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });

    doc.setFontSize(11);
    doc.text(
      `Printed on: ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() - 50,
      20
    );

    const tableColumns = columns.map((col) => ({
      header: col.name,
      dataKey: col.name,
    }));

    const tableRows = tableData.map((row) => {
      return columns.map((col) => col.selector(row));
    });

    doc.autoTable({
      head: [tableColumns.map((col) => col.header)],
      body: tableRows,
      startY: 40,
      margin: { top: 40 },
      theme: "striped",
      styles: {
        halign: "left",
        valign: "middle",
      },
      headStyles: {
        fillColor: "#0070C0",
        textColor: "#ffffff",
      },
    });

    doc.save("Employee_report.pdf");
  };

  const handleExportExcel = () => {
    const { companyLogoBase64, companyName } = config;

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Prepare data for the worksheet
    const wsData = [
      // [companyName], // Company Name
      // [`Printed on: ${new Date().toLocaleDateString()}`], // Date
      // [] // Empty row
    ];

    // Add table headers
    wsData.push(columns.map((col) => col.name));

    // Add table rows
    tableData.forEach(row => {
      wsData.push(columns.map(col => col.selector(row)));
    });

    // Create a worksheet and append it to the workbook
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Employee Report");

    // Save the workbook
    XLSX.writeFile(wb, "Employee_report.xlsx");

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
          style={{ width: "100%" }}
        />
      </Col>
      <Col md={2}>
        <Button color="primary" onClick={handleExportPDF} className="w-100">
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
