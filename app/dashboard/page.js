"use client";
// import node module libraries
import { Fragment, useState, useEffect } from "react";
import Link from "next/link";
import { Container, Col, Row } from "react-bootstrap";
import { Briefcase, ListTask, People, Bullseye } from "react-bootstrap-icons";
import { getUserData,getTotalReceivableAmount,getTotalUsers,getTotalSuppliers,getTotalEmployees,getTotalCustomers,getTotalExpenses,getTotalProfit,getTotalReceivedAmount,getTotalProducts  } from "common/utils";

// import widget/custom components
import { StatRightTopIcon } from "widgets";

// import sub components
import { ActiveProjects, Teams, TasksPerformance } from "sub-components";

const Home = () => {
  const [receivables, setReceivables] = useState('');
  const [received, setReceived] = useState('');
  const [profit, setProfit] = useState('');
  const [expenses, setExpenses] = useState('');
  const [customers, setCustomers] = useState('');
  const [employees, setEmployees] = useState('');
  const [users, setUsers] = useState('');
  const [suppliers, setSuppliers] = useState('');
  const [products, setProducts] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalReceivable = await getTotalReceivableAmount();
        setReceivables(totalReceivable);
        const totalReceived = await getTotalReceivedAmount();
        setReceived(totalReceived);
        const totalProfit = await getTotalProfit();
        setProfit(totalProfit);
        const totalExpenses = await getTotalExpenses();
        setExpenses(totalExpenses);

        const totalCustomers = await getTotalCustomers();
        setCustomers(totalCustomers);
        const totalEmployees = await getTotalEmployees();
        setEmployees(totalEmployees);

        const totalSuppliers = await getTotalSuppliers();
        setSuppliers(totalSuppliers);
        const TotalUsers = await getTotalUsers();
        setUsers(TotalUsers);
        const TotalProducts = await getTotalProducts();
        setProducts(TotalProducts);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

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
      value: customers?.data?.total,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${employees}</span> Employees`,
    },
    {
      id: 4,
      title: "Suppliers",
      value: suppliers?.data?.total,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
    {
      id: 4,
      title: "Employees",
      value: employees?.data?.total,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
    {
      id: 4,
      title: "Users",
      value: users?.data?.total,
      icon: <People size={18} />,
      // statInfo: `<span className="text-dark me-2">${users}</span> Users`,
    },
    {
      id: 4,
      title: "Products",
      value: products?.data?.total,
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
        <ActiveProjects />

        <Row className="my-6">
          <Col xl={4} lg={12} md={12} xs={12} className="mb-6 mb-xl-0">
            {/* Tasks Performance */}
            <TasksPerformance />
          </Col>
          {/* card */}
          <Col xl={8} lg={12} md={12} xs={12}>
            {/* Teams */}
            <Teams />
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Home;
