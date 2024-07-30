import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Plus } from "react-feather";
import { Button, Card, CardBody } from "reactstrap";
import request from "../utils/axios";
import ExpandableRowDetail from "./ExpandableRowDetail";
import TableLoading from "./Loading";
import Pagination from "./Pagination";
import TableHeader from "./TableHeader";
import config from "../../config.js"
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
const Table = ({
  columns,
  title,
  url,
  expandableRows = false,
  selectableRows = false,
  onCreateAction,
  query = null,
  populate = [],
  searchFields = [],
  companyName = config.companyName, // Use company name from config
  companyLogo = config.companyLogoBase64, // Use logo from config
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState({ createdAt: "desc" });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [url, page],
    queryFn: () =>
      request({
        url: url,
        method: "GET",
        params: {
          query,
          search: {
            keyword: debouncedSearch,
            fields: searchFields,
          },
          options: {
            limit: rowsPerPage,
            page,
            populate,
            sort: sortBy,
          },
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    keepPreviousData: true,

    select: (res) => res.data?.data,
  });

  useEffect(() => {
    !isLoading && refetch();
  }, [page, rowsPerPage, sortBy, debouncedSearch]);

  const handlePageChange = (page) => setPage(page.selected + 1);

  const handlePerPage = (e) => {
    const value = e.target.value;
    setRowsPerPage(value);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  const exportToExcel = () => {
    const formattedData = data.docs.map(row => {
      const formattedRow = {};
      columns.forEach(col => {
        if (col.selector) {
          formattedRow[col.name] = col.selector(row);
        }
      });
      return formattedRow;
    });

    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = columns.map(col => col.name);
    const tableRows = data.docs.map(row => columns.map(col => col.selector ? col.selector(row) : ''));

    const currentDate = new Date().toLocaleDateString();

    // Add the company logo and name
    if (companyLogo) {
      doc.addImage(companyLogo, 'PNG', 10, 10, 30, 30); // Adjust the position and size as needed
    }

    doc.setFontSize(20);
    doc.text(companyName, doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' }); // Center align the company name

    doc.setFontSize(10);
    doc.text(`Printed on: ${currentDate}`, doc.internal.pageSize.getWidth() - 10, 10, { align: 'right' }); // Align the print date to the right

    doc.autoTable({
      startY: 50, // Adjust to leave space for the header
      head: [tableColumn],
      body: tableRows,
    });
    doc.save('data.pdf');
  };
  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between">
            <div>

            <h4>{title} Management</h4>
            <div>
              <Button color="success" className="px-4 me-2" onClick={exportToExcel}>
                Export to Excel
              </Button>
              <Button color="primary" className="px-4 me-2" onClick={exportToPDF}>
                Export to PDF
              </Button>
             
            </div>
            </div>
            <div>
            {onCreateAction && (
            <Button color="primary" className="px-4" onClick={onCreateAction}>
              <Plus /> New {title}
            </Button>

            )}
            </div>
          </div>
        </CardBody>
        <div className="react-dataTable">
          <DataTable
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            striped
            columns={columns}
            sortIcon={<ChevronDown />}
            onSort={(column, direction) => {
              if (column.sortField) {
                setSortBy({ [column.sortField]: direction });
              }
            }}
            className="react-dataTable card-company-table"
            expandableRows={expandableRows}
            expandableRowsComponent={ExpandableRowDetail}
            //on
            selectableRows={selectableRows}
            onSelectedRowsChange={(e) => setSelectedRows(e.selectedRows)}
            //
            paginationComponent={() => (
              <Pagination
                currentPage={page}
                handlePageChange={handlePageChange}
                rowsPerPage={rowsPerPage}
                total={data.totalDocs}
              />
            )}
            data={data?.docs}
            progressPending={isLoading}
            progressComponent={<TableLoading columns={columns} />}
            subHeaderComponent={
              <TableHeader
                data={data?.docs}
                searchTerm={search}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
              />
            }
          />
        </div>
      </Card>
    </>
  );
};

export default Table;
