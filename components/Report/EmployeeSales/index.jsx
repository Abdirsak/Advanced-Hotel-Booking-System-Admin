"use client";

import React, { useState } from "react";
import DateFilter from "./components/DateFilter";
import EmployeeSalesTable from "./components/EmployeeSalesTable";
import ExportButtons from "./components/ExportButtons";
import { Card, CardBody, CardHeader, Container } from "reactstrap";

const sampleData = [
  {
    employeeId: 1,
    name: "John Doe",
    totalSales: 1500,
    transactions: 10,
    date: "2024-08-01",
  },
  {
    employeeId: 2,
    name: "Jane Smith",
    totalSales: 2000,
    transactions: 15,
    date: "2024-08-02",
  },
  {
    employeeId: 3,
    name: "Alice Johnson",
    totalSales: 1800,
    transactions: 12,
    date: "2024-08-03",
  },
  {
    employeeId: 4,
    name: "Bob Brown",
    totalSales: 2200,
    transactions: 20,
    date: "2024-08-04",
  },
  {
    employeeId: 5,
    name: "Charlie Davis",
    totalSales: 2500,
    transactions: 22,
    date: "2024-08-05",
  },
  {
    employeeId: 6,
    name: "Diana Evans",
    totalSales: 1700,
    transactions: 11,
    date: "2024-08-06",
  },
  {
    employeeId: 7,
    name: "Evan Green",
    totalSales: 1600,
    transactions: 14,
    date: "2024-08-07",
  },
  {
    employeeId: 8,
    name: "Fiona Harris",
    totalSales: 3000,
    transactions: 25,
    date: "2024-08-08",
  },
  {
    employeeId: 9,
    name: "George King",
    totalSales: 1900,
    transactions: 18,
    date: "2024-08-09",
  },
  {
    employeeId: 10,
    name: "Hannah Lewis",
    totalSales: 2400,
    transactions: 21,
    date: "2024-08-10",
  },
  {
    employeeId: 11,
    name: "Ian Miller",
    totalSales: 1300,
    transactions: 9,
    date: "2024-08-11",
  },
  {
    employeeId: 12,
    name: "Jessica Moore",
    totalSales: 2100,
    transactions: 17,
    date: "2024-08-12",
  },
  {
    employeeId: 13,
    name: "Kevin Nelson",
    totalSales: 2600,
    transactions: 23,
    date: "2024-08-13",
  },
  {
    employeeId: 14,
    name: "Laura Parker",
    totalSales: 2800,
    transactions: 24,
    date: "2024-08-14",
  },
  {
    employeeId: 15,
    name: "Michael Quinn",
    totalSales: 2900,
    transactions: 26,
    date: "2024-08-15",
  },
  {
    employeeId: 16,
    name: "Natalie Roberts",
    totalSales: 2200,
    transactions: 20,
    date: "2024-08-16",
  },
  {
    employeeId: 17,
    name: "Oliver Scott",
    totalSales: 2700,
    transactions: 22,
    date: "2024-08-17",
  },
  {
    employeeId: 18,
    name: "Paula Turner",
    totalSales: 2300,
    transactions: 19,
    date: "2024-08-18",
  },
  {
    employeeId: 19,
    name: "Quinn Underwood",
    totalSales: 2400,
    transactions: 21,
    date: "2024-08-19",
  },
  {
    employeeId: 20,
    name: "Rachel White",
    totalSales: 2500,
    transactions: 22,
    date: "2024-08-20",
  },
];

const SalesReport = () => {
  const [filteredData, setFilteredData] = useState(sampleData);
  const [searchTerm, setSearchTerm] = useState("");

  const filterDataByDate = (fromDate, toDate) => {
    const filtered = sampleData.filter((entry) => {
      return entry.date >= fromDate && entry.date <= toDate;
    });
    setFilteredData(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filtered = sampleData.filter((entry) =>
      entry.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <Container className="mt-5">
      <Card>
        <CardHeader>
          <h3 className="mb-4">Employee Sales Report</h3>
        </CardHeader>
        <CardBody>
          <DateFilter onFilter={filterDataByDate} />
          <ExportButtons onSearch={handleSearch} />
          <EmployeeSalesTable data={filteredData} />
        </CardBody>
      </Card>
    </Container>
  );
};

export default SalesReport;
