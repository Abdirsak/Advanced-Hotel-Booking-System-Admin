"use client";

import React, { useState, useEffect } from "react";
import moment from "moment";
import DateFilter from "./components/DateFilter";

import ExportButtons from "./components/ExportButtons";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
  Spinner,
  Badge,
} from "reactstrap";
import { useQuery } from "@tanstack/react-query"; // Importing useQuery from react-query
import request from "common/utils/axios";
import LoanTable from "./components/LoanTable";

const columns = [
  {
    name: "Name",
    sortable: true,
    sortField: "name",
    selector: (row) => row?.name ?? "",
    cell: (row) => <div style={{ width: "500px" }} className="">{row?.name ?? ""}</div>,
  },
  {
    name: "Gender",
    sortable: true,
    sortField: "gender",
    selector: (row) => row?.gender ?? "",
    cell: (row) => <div className="">{row?.gender ?? ""}</div>,
  },
  {
    name: "Phone",
    sortable: true,
    sortField: "contact",
    selector: (row) => row?.contact ?? "",
    cell: (row) => <div className="">{row?.contact ?? ""}</div>,
  },

  {
    name: "Amount",
    sortable: true,
    sortField: "amount",
    selector: (row) => row?.amount ?? "",
    cell: (row) => <div className="">{row?.amount ?? ""}</div>,
  },
  {
    name: "Returned Amount",
    sortable: true,
    sortField: "returnedAmount",
    selector: (row) => row?.returnedAmount ?? "",
    cell: (row) => <div className="">{row?.returnedAmount ?? ""}</div>,
  },
  {
    name: "Status",
    sortable: true,
    sortField: "status",
    selector: (row) => row?.status ?? "",
    cell: (row) => <div className="">{row?.status ?? ""}</div>,
  },

  {
    name: "StartDate Date",
    sortable: true,
    sortField: "startDate",
    selector: (row) => row.startDate,
    cell: (row) => (
      <span className="text-capitalize">
        {" "}
        {moment(row.startDate).format("DD-MMM-YYYY")}
      </span>
    ),
  },
  {
    name: "End Date",
    sortable: true,
    sortField: "endDate",
    selector: (row) => row.endDate,
    cell: (row) => (
      <span className="text-capitalize">
        {" "}
        {moment(row.endDate).format("DD-MMM-YYYY")}
      </span>
    ),
  },
  {
    name: "Description",
    sortable: true,
    sortField: "description",
    selector: (row) => row?.description,
    cell: (row) => <div className="">{row?.description ?? ""}</div>,
  },



];

const LoansReport = () => {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Fetching data using react-query
  const {
    data: Loans = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["/reports/loans-report"],
    queryFn: () =>
      request({
        url: "/reports/loans-report",
        method: "GET",
        params: {},
        options: {
          sort: { createdAt: "desc" },
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    keepPreviousData: true,
    select: (res) => (Array.isArray(res?.data?.data) ? res?.data?.data : []),
  });

  // Apply initial data to filteredData
  useEffect(() => {
    setFilteredData(Loans);
  }, [Loans]);

  // Refetch data on filter change
  useEffect(() => {
    refetch();
  }, [startDate, endDate, searchTerm, page, rowsPerPage, sortBy, refetch]);

  // Filter data by date and search term
  const filterData = () => {
    const filtered = Loans.filter((entry) => {
      const isWithinDateRange =
        (!startDate || entry.LoansDate >= startDate) &&
        (!endDate || entry.purchaseDate <= endDate);
      const matchesSearchTerm = entry.Name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return isWithinDateRange && matchesSearchTerm;
    });
    setFilteredData(filtered);
  };

  // Update filters
  const filterDataByDate = (fromDate, toDate) => {
    setStartDate(fromDate);
    setEndDate(toDate);
    filterData();
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterData();
  };

  return (
    <Container className="mt-5">
      <Card>
        <CardHeader>
          <h3 className="mb-4">Loans Report</h3>
        </CardHeader>
        <CardBody>

          <ExportButtons
            onSearch={handleSearch}
            columns={columns}
            tableData={filteredData}
          />
          <DateFilter onFilter={filterDataByDate} />
          {isLoading ? (
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ minHeight: "200px" }}
            >
              <Spinner
                color="primary"
                style={{ width: "3rem", height: "3rem" }}
              >
                Loading...
              </Spinner>
            </div>
          ) : (
            <LoanTable data={filteredData} />
          )}
        </CardBody>
      </Card>
    </Container>
  );
};

export default LoansReport;
