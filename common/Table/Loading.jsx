import React from "react";

//3rd party packages
import { Table, Spinner } from "reactstrap";

const TableLoading = ({ columns }) => {
  return (
    <Table striped>
      {/* <thead> */}
      {/* <tr>
        {columns.map((column, index) => (
          <td key={index}>{column.name}</td>
        ))}
      </tr> */}
      {/* </thead> */}
      <tbody>
        <tr>
          <td
            colSpan={columns.length}
            className="text-center"
            style={{ minHeight: "500px" }}
          >
            <Spinner color="primary" />
          </td>
        </tr>
      </tbody>
    </Table>
  );
};

export default TableLoading;
