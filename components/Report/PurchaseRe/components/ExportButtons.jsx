"use client";
// /components/ExportButtons/ExportButtons.jsx

import React from "react";
import { Button, Input, Row, Col } from "reactstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";
import config from "../../../../config";
import moment from "moment";
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

    // Map the columns correctly using the existing definition
    const tableColumns = columns.map((col) => ({
      header: col.name,
      dataKey: col.sortField || col.name, // Use sortField if available for uniqueness
    }));

    // Define the rows for the table data using the selectors
    const tableRows = tableData.map((row) => {
      return columns.map((col) => {
        if (col.name === "Purchase Date") {
          return moment(row.purchaseDate).format("DD-MM-YYYY"); // Format Purchase Date
        } else if (col.name === "Total Amount") {
          return `$${row.totalAmountSpent.toFixed(2)}`; // Format Total Amount
        } else {
          return col.selector(row); // Use existing selector
        }
      });
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

    doc.save("Purchase_report.pdf");
  };

  const handleExportExcel = () => {
    // Define the data to export
    const exportData = tableData.map((row) => {
      // Create an object that matches the columns structure
      const rowData = {};
      columns.forEach((col) => {
        if (col.name === "Purchase Date") {
          rowData[col.name] = moment(row.purchaseDate).format("DD-MM-YYYY");
        } else if (col.name === "Total Amount") {
          rowData[col.name] = `$${row.totalAmountSpent.toFixed(2)}`;
        } else {
          rowData[col.name] = col.selector(row);
        }
      });
      return rowData;
    });

    // Define the columns headers based on the columns array
    const headers = columns.map((col) => col.name);

    // Convert JSON data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData, { header: headers });

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');

    // Export the workbook to a file
    XLSX.writeFile(workbook, 'Purchase_report.xlsx');
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
