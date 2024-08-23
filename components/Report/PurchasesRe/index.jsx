"use client";
import { PageHeading } from "widgets";
import PurchaseReport from "./PurchaseReport";
import { Container } from "react-bootstrap";

const Category = () => {
   return (
      <Container fluid className="p-6">
         {/* <PageHeading heading="Categories" /> */}
         <div className="py-2">
            <PurchaseReport />
         </div>
      </Container>
   );
};

export default Category;