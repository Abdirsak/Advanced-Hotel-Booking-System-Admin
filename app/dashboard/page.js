"use client";
// import node module libraries
import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";
import { Briefcase, ListTask, People, Bullseye } from "react-bootstrap-icons";
import { getUserData,getTotalReceivableAmount,getTotalUsers,getTotalSuppliers,getTotalEmployees,getTotalCustomers,getTotalExpenses,getTotalProfit,getTotalReceivedAmount,getTotalProducts  } from "common/utils";
import { Badge } from "reactstrap";
import { useQuery } from "@tanstack/react-query";
import DataTable from "react-data-table-component";
import { ChevronDown, Plus } from "react-feather";
import { Button, Card, CardBody } from "reactstrap";
import request from "common/utils/axios";
// import widget/custom components
import { StatRightTopIcon } from "widgets";
import moment from "moment";
import Swal from "sweetalert2";
//custom packages
// import Table from "common/Table";
import { LastFiveInvoicesAPI } from "common/utils/axios/api";
// import sub components

const Home = () => {
  const [token, setToken] = useState(null);
  const [receivables, setReceivables] = useState('');
  const [received, setReceived] = useState('');
  const [profit, setProfit] = useState('');
  const [expenses, setExpenses] = useState('');
  const [customers, setCustomers] = useState('');
  const [employees, setEmployees] = useState('');
  const [users, setUsers] = useState('');
  const [suppliers, setSuppliers] = useState('');
  const [products, setProducts] = useState('');

  // First useEffect to set the token
  useEffect(() => {
    const fetchedToken = localStorage.getItem("token");
    setToken(fetchedToken);
  }, []);

  // Second useEffect to fetch data, depends on the token
  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const totalReceivable = await getTotalReceivableAmount(token);
          setReceivables(totalReceivable);
          const totalReceived = await getTotalReceivedAmount(token);
          setReceived(totalReceived);
          const totalProfit = await getTotalProfit(token);
          setProfit(totalProfit);
          const totalExpenses = await getTotalExpenses(token);
          setExpenses(totalExpenses);

          const totalCustomers = await getTotalCustomers(token);
          setCustomers(totalCustomers);
          const totalEmployees = await getTotalEmployees(token);
          setEmployees(totalEmployees);

          const totalSuppliers = await getTotalSuppliers(token);
          setSuppliers(totalSuppliers);
          const TotalUsers = await getTotalUsers(token);
          setUsers(TotalUsers);
          const TotalProducts = await getTotalProducts(token);
          setProducts(TotalProducts);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [token]);

  // console.log(receivables?.data?.total)
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  const ProjectsStats = [
    {
      id: 1,
      title: "Total Receivable Amount",
      value: receivables ? formatCurrency(receivables?.data?.total) : '$0.00',
      icon: <Briefcase size={18} />,
      // statInfo: `<span className="text-dark me-2">${received}</span> Received`,
    },
    {
      id: 1,
      title: "Received Amount",
      value: received ? formatCurrency(received?.data?.total) : '$0.00',
      icon: <Briefcase size={18} />,
      // statInfo: `<span className="text-dark me-2">${received}</span> Received`,
    },
    {
      id: 2,
      title: "Profit",
      value: profit ? formatCurrency(profit?.data?.total) : '$0.00',
      icon: <Bullseye size={18} />,
      // statInfo: `<span className="text-dark me-2">${expenses}</span> Expenses`,
    },
    {
      id: 3,
      title: "Customers",
      value: customers?.data?.total ? customers?.data?.total : 0,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${employees}</span> Employees`,
    },
    {
      id: 4,
      title: "Suppliers",
      value: suppliers?.data?.total ? suppliers?.data?.total : 0,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
    {
      id: 4,
      title: "Employees",
      value: employees?.data?.total ? employees?.data?.total : 0,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
    {
      id: 4,
      title: "Users",
      value: users?.data?.total? users?.data?.total : 0,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
    {
      id: 4,
      title: "Products",
      value: products?.data?.total? products?.data?.total : 0,
      icon: <Bullseye size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
  ];

  return (
    <Fragment>
      <div className="bg-primary pt-10 pb-21"></div>
      <Container fluid className="mt-n22 px-6">
        <Row>
          {ProjectsStats?.map((item, index) => (
            <Col xl={3} lg={6} md={12} xs={12} className="mt-6" key={index}>
              <StatRightTopIcon info={item} />
            </Col>
          ))}
        </Row>

        {/* Active Projects */}
        {/* <ActiveProjects />
         */}

      <LastFiveInvoices /> 
        {/* <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            {/* Tasks Performance */}
            {/* <TasksPerformance />
          </Col>
          {/* card */}
          {/* <Col xl={8} lg={12} md={12} xs={12}> */}
            {/* Teams */}
            {/* <Teams /> */}
          {/* </Col> */}
        {/* </Row> */} 
      </Container>
    </Fragment>
  );
};

export default Home;



const LastFiveInvoices = ()=>{
  const columns = [
    {
      name: "Customer",
      sortable: true,
      sortField: "customerData.fullName",
      selector: (row) => row.customerData?.fullName,
      cell: (row) => <div style={{width:"400px"}} className="">{row?.customerData?.fullName ?? ""}</div>,
    },
    {
      name: "Contact",
      sortable: true,
      sortField: "customerData.contact",
      selector: (row) => row.customerData?.contact,
      cell: (row) => <div className="">{row?.customerData?.contact ?? ""}</div>,
    },
    {
      name: "Invoice Date",
      sortable: true,
      sortField: "invoiceDate",
      selector: (row) => row.invoiceDate,
      cell: (row) => (
        <span className="text-capitalize">
          {" "}
          {moment(row.invoiceDate).format("DD-MMM-YYYY")}
        </span>
      ),
    },

    
    {
      name: "Total Amount",
      sortable: true,
      sortField: "totalAmount",
      selector: (row) => row.totalAmount,
      cell: (row) => <div className="">{row?.totalAmount ?? ""}</div>,
    },
    {
      name: "Paid Amount",
      sortable: true,
      sortField: "paidAmount",
      selector: (row) => row.paidAmount,
      cell: (row) => <div className="">{row?.paidAmount ?? ""}</div>,
    },
    {
      name: "Balance",
      sortable: true,
      sortField: "balance",
      selector: (row) => row?.balance,
      cell: (row) => <div className="">{row?.totalAmount - row?.paidAmount  ?? ""}</div>,
    },
    {
      name: "Status",
      sortable: true,
      sortField: "status",
      selector: (row) => row.status,
      cell: (row) => ( <Badge color={`${row?.status === "unpaid" ? "warning" : "success"}`}>
      <span className="text-capitalize fs-6">{row?.status}</span>
    </Badge>
      )
    }

  ];
  return (
    <>
     
      <Table
        columns={columns}
        // onCreateAction={() => setShowModal(true)}
        populate={[]}
        query={{}}
        title="Invoices"
        url={LastFiveInvoicesAPI}
        searchFields={["name"]}
      />
    </>
  );
}



const Table = ({
  columns,
  url,
  query = null,
  populate = [],
}) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState({ createdAt: "desc" });

  const [selectedRows, setSelectedRows] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [url, page],
    queryFn: () =>
      request({
        url: url,
        method: "GET",
        params: {
          query,
          keyword: "",
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
  }, [page, rowsPerPage, sortBy]);

  const handlePageChange = (page) => setPage(page.selected + 1);

  const handleFilter = (e) => {
    const value = e.target.value;
    console.log(value);
    setSearch(value);
  };

  const handlePerPage = (e) => {
    const value = e.target.value;
    setRowsPerPage(value);
  };

  useEffect(() => {
    setPage(1);
  }, [rowsPerPage]);

  return (
    <>
      <Card className="my-5">
        <div className="react-dataTable my-3">
          <DataTable
         
            striped
            columns={columns}
            sortIcon={<ChevronDown />}
            onSort={(column, direction) => {
              if (column.sortField) {
                setSortBy({ [column.sortField]: direction });
              }
            }}
            className="react-dataTable card-company-table"
            
       
            data={data?.docs}
            progressPending={isLoading}
        
          />
        </div>
      </Card>
    </>
  );
};