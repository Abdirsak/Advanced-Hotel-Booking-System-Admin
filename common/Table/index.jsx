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
