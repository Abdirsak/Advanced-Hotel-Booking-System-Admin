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
import FilterHeader from "./FilterHeader"; // Ensure you import the FilterHeader

const TableFiltration = ({
  columns,
  title,
  url,
  expandableRows = false,
  selectableRows = false,
  onCreateAction,
  query = null,
  populate = [],
  searchFields = [],
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortBy, setSortBy] = useState({ createdAt: "desc" });
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [url, page, debouncedSearch, startDate, endDate, rowsPerPage, sortBy],
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
          filters: {
            startDate: startDate ? new Date(startDate).toISOString() : undefined,
            endDate: endDate ? new Date(endDate).toISOString() : undefined,
          },
        },
      }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    keepPreviousData: true,
    select: (res) => res.data?.data,
    enabled: false, // disable automatic query execution
  });

  const handlePageChange = (page) => setPage(page.selected + 1);

  const handlePerPage = (e) => {
    const value = e.target.value;
    setRowsPerPage(value);
    setPage(1);
  };

  const handleFilter = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleFilterClick = () => {
    refetch();
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
    refetch();
  }, [page, rowsPerPage, sortBy, debouncedSearch]);

  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-between">
            <h4>{title} Management</h4>
            {onCreateAction && (
              <Button color="primary" className="px-4" onClick={onCreateAction}>
                <Plus /> New {title}
              </Button>
            )}
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
            selectableRows={selectableRows}
            onSelectedRowsChange={(e) => setSelectedRows(e.selectedRows)}
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
              <>
                <TableHeader
                  data={data?.docs}
                  searchTerm={search}
                  rowsPerPage={rowsPerPage}
                  handleFilter={handleFilter}
                  handlePerPage={handlePerPage}
                />
                <FilterHeader
                  startDate={startDate}
                  endDate={endDate}
                  handleStartDateChange={handleStartDateChange}
                  handleEndDateChange={handleEndDateChange}
                  handleFilter={handleFilterClick}
                />
              </>
            }
          />
        </div>
      </Card>
    </>
  );
};

export default TableFiltration;
