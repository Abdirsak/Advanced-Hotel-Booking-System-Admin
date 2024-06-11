import ReactPaginate from "react-paginate";

const Pagination = ({
  currentPage = 1,
  handlePageChange,
  rowsPerPage = 10,
  total = 0,
}) => {
  const count = Number(Math.ceil(total / rowsPerPage));

  return (
    <ReactPaginate
      previousLabel={"<"}
      nextLabel={">"}
      pageCount={count || 1}
      activeClassName="active"
      forcePage={currentPage !== 0 ? currentPage - 1 : 0}
      onPageChange={handlePageChange}
      pageClassName={"page-item"}
      nextLinkClassName={"page-link"}
      nextClassName={"page-item next"}
      previousClassName={"page-item prev"}
      previousLinkClassName={"page-link"}
      pageLinkClassName={"page-link"}
      containerClassName={
        "pagination react-paginate justify-content-center my-2 pe-1 gap-1"
      }
    />
  );
};

export default Pagination;
