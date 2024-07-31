import React, { forwardRef, useImperativeHandle } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

const InvoiceTemplate = forwardRef(({ invoiceData }, ref) => {
    // console.log("------------------", invoiceData)
  const generatePDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 128); // Dark blue color
    doc.text("CARWO BASHAASH AND ELECTRONICS", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text("Tel: 0616801414 / 0615532285 / 0616332424 / 0620332424", 105, 28, null, null, "center");

    doc.setFontSize(14);
    doc.text("Afgooye - Somalia", 105, 38, null, null, "center");
    doc.text("INVOICE", 105, 48, null, null, "center");

    // Add invoice details
    doc.setFontSize(12);
    doc.text(`Date: ${invoiceData.date}`, 10, 58);
    doc.text(`Name: ${invoiceData.name}`, 10, 65);
    doc.text(`Invoice No: ${invoiceData.invoiceNo}`, 150, 58);
    doc.text(`Tel: ${invoiceData.customerTel}`, 150, 65);

    // Add table
    const tableColumn = ["No", "DESCRIPTION", "QTY", "U.Price", "Amount"];
    const tableRows = [];

    invoiceData.items.forEach((item, index) => {
      const rowData = [
        index + 1,
        item.description,
        item.qty,
        `$${item.unitPrice?.toFixed(2)}`,
        `$${(item.qty * item.unitPrice)?.toFixed(2)}`,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      startY: 75,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [0, 0, 128], // Dark blue color
        textColor: [255, 255, 255], // White text color
        fontStyle: "bold",
      },
      bodyStyles: {
        fillColor: [245, 245, 245], // Light grey color for rows
        textColor: [0, 0, 0], // Black text color
        fontStyle: "normal",
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255], // White color for alternate rows
      },
      styles: {
        font: "helvetica",
        fontSize: 10,
      },
    });


    // Add totals and lines
    const finalY = doc.lastAutoTable.finalY;
    doc.setFont("helvetica", "bold");
    doc.text(`G.Total: $${invoiceData.total.toFixed(2)}`, 150, finalY + 10);
    doc.text(`Paid: $${invoiceData.paid.toFixed(2)}`, 150, finalY + 20);
    doc.text(`Rest: $${(invoiceData.total - invoiceData?.paid)?.toFixed(2)}`, 150, finalY + 30);

    // Draw lines
    doc.setLineWidth(0.5);
    doc.line(145, finalY + 12, 195, finalY + 12); // Underline G.Total
    doc.line(145, finalY + 22, 195, finalY + 22); // Underline Paid
    doc.line(145, finalY + 32, 195, finalY + 32); // Underline Rest
    doc.line(10, finalY + 54, 60, finalY + 54); // Underline Authorized Signature

    // Add footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Authorized Signature", 10, finalY + 45);
    doc.text("F.G: Fadlan Iska Hubi Alaabta Inta Aadan Qaadan Kahor.", 105, finalY + 60, null, null, "center");

    // Save PDF
    doc.save(`invoice_${invoiceData.invoiceNo}.pdf`);
  };

  useImperativeHandle(ref, () => ({
    generatePDF,
  }));

  return null;
});

export default InvoiceTemplate;
