import { Fragment, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "common/utils/axios/index";

// 3rd party packages
import Joi from "joi";
import { Controller, useForm, useWatch } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import {
  Button,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";

// custom packages
import {
  ReceiptsApi,
  InvoicesApi,
  CustomersApi,
} from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

// validation schema
const schema = Joi.object({
  customerId: Joi.string().required().label("Customer"),
  invoiceId: Joi.string().required().label("Invoice"),
  method: Joi.string()
    .valid("EVC", "CASH", "ACCOUNT")
    .required()
    .label("Method"),
  description: Joi.string().required().label("Description"),
  receiptDate: Joi.date().required().label("Receipt Date"),
  amount: Joi.number().required().label("Amount"),
  receiptNo: Joi.string().required().label("Receipt No"),
  reference: Joi.string().required().label("Reference"),
  balance: Joi.number().allow(null).label("Balance"),
});

const fetchCustomers = async () => {
  const response = await request({
    method: "GET",
    url: CustomersApi,
  });
  return response.data;
};

const fetchInvoices = async () => {
  const response = await request({
    method: "GET",
    url: InvoicesApi,
  });
  return response.data;
};

const useCustomers = () => {
  return useQuery({
    queryKey: "customers",
    queryFn: fetchCustomers,
  });
};

const useInvoices = () => {
  return useQuery({
    queryKey: "invoices",
    queryFn: fetchInvoices,
  });
};

// component
const InvoiceModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();
  const { data: customerData } = useCustomers();
  const { data: invoicesData } = useInvoices();

  const defaultValues = {
    method: "",
    customerId: "",
    invoiceId: "",
    description: "",
    receiptDate: "",
    amount: "",
    receiptNo: "",
    balance: 0,
    reference: ''
  };

  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({ defaultValues, resolver: joiResolver(schema) });

  console.log(errors)
  
  const invoiceId = useWatch({ control, name: "invoiceId" });
  const amount = useWatch({ control, name: "amount" });

  const selectedInvoice = invoicesData?.data?.docs?.find(
    (invoice) => invoice._id === invoiceId
  );

  const balance = selectedInvoice
    ? selectedInvoice.totalAmount - (selectedInvoice.paidAmount || 0) - (amount || 0)
    : 0;

  const { mutate, isPending: isLoading } = useCreate(
    ReceiptsApi,
    "Receipt Created Successfully",
    () => {
      setShowModal(false);
      reset(defaultValues);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ReceiptsApi,
    "Receipt Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
      reset(defaultValues);
    }
  );

  const onSubmit = (data) => {
    console.log('Form Data:', data); // Add logging
    const receiptData = {
      ...data,
      balance,
    };

    if (selectedRow) {
      mutateUpdate({ data: receiptData, updateId: selectedRow?._id });
    } else {
      mutate(receiptData);
    }
  };

  const onDiscard = () => {
    clearErrors();
    reset(defaultValues);
    setShowModal(false);
    setSelectedRow && setSelectedRow(null);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (selectedRow) {
      reset({
        customerId: selectedRow?.customerId || "",
        invoiceId: selectedRow?.invoiceId || "",
        method: selectedRow?.method || "",
        description: selectedRow?.description || "",
        receiptDate: selectedRow?.receiptDate?.split("T")[0] || "",
        amount: selectedRow?.amount || "",
        receiptNo: selectedRow?.receiptNo || "",
        balance: selectedRow?.balance || "",
        reference: selectedRow?.reference || ""
      });
    }
  }, [selectedRow, reset]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClosed={onDiscard}
        toggle={toggleModal}
        size="lg"
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Receipt" : "Update Receipt"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="customer">
                  Customer
                </Label>
                <Controller
                  name="customerId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="customer"
                      type="select"
                      {...register("customerId")}
                      invalid={errors.customerId && true}
                      {...field}
                      defaultValue={
                        selectedRow ? selectedRow?.customerId : ""
                      }
                    >
                      <option value="">Select Customer</option>
                      {customerData?.data?.docs?.map((customer) => (
                        <option key={customer._id} value={customer._id}>
                          {customer?.fullName}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.customerId && (
                  <FormFeedback>{errors.customerId.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="method">
                  Method
                </Label>
                <Controller
                  name="method"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="method"
                      type="select"
                      {...register("method")}
                      invalid={errors.method && true}
                      {...field}
                    >
                      <option value="">Select Method</option>
                      <option value="EVC">EVC</option>
                      <option value="CASH">CASH</option>
                      <option value="ACCOUNT">ACCOUNT</option>
                    </Input>
                  )}
                />
                {errors.method && (
                  <FormFeedback>{errors.method.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="receiptDate">
                  Receipt Date
                </Label>
                <Controller
                  name="receiptDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="receiptDate"
                      type="date"
                      placeholder="Receipt Date"
                      {...register("receiptDate")}
                      invalid={errors.receiptDate && true}
                      {...field}
                    />
                  )}
                />
                {errors.receiptDate && (
                  <FormFeedback>{errors.receiptDate.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="receiptNo">
                  Receipt No
                </Label>
                <Controller
                  name="receiptNo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="receiptNo"
                      placeholder="Receipt No"
                      {...register("receiptNo")}
                      invalid={errors.receiptNo && true}
                      {...field}
                    />
                  )}
                />
                {errors.receiptNo && (
                  <FormFeedback>{errors.receiptNo.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="reference">
                  Reference
                </Label>
                <Controller
                  name="reference"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="reference"
                      placeholder="Reference"
                      {...register("reference")}
                      invalid={errors.reference && true}
                      {...field}
                    />
                  )}
                />
                {errors.reference && (
                  <FormFeedback>{errors.reference.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="invoiceId">
                  Invoice
                </Label>
                <Controller
                  name="invoiceId"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="invoiceId"
                      type="select"
                      {...register("invoiceId")}
                      invalid={errors.invoiceId && true}
                      {...field}
                      defaultValue={
                        selectedRow ? selectedRow?.invoiceId : ""
                      }
                    >
                      <option value="">Select Invoice</option>
                      {invoicesData?.data?.docs?.map((invoice) => (
                        <option key={invoice._id} value={invoice._id}>
                          {invoice?.reference}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.invoiceId && (
                  <FormFeedback>{errors.invoiceId.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="amount">
                  Amount
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Amount"
                      {...register("amount")}
                      invalid={errors.amount && true}
                      {...field}
                    />
                  )}
                />
                {errors.amount && (
                  <FormFeedback>{errors.amount.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="balance">
                  Balance
                </Label>
                <Input
                  id="balance"
                  placeholder="Balance"
                  disabled
                  value={balance}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12} lg={12} className="mb-2">
                <Label className="form-label" for="description">
                  Description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="description"
                      className="py-4"
                      placeholder="Description"
                      {...register("description")}
                      invalid={errors.description && true}
                      {...field}
                    />
                  )}
                />
                {errors.description && (
                  <FormFeedback>{errors.description.message}</FormFeedback>
                )}
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Col className="d-flex justify-content-end">
              <Button
                type="submit"
                className="me-1"
                color="primary"
                disabled={isLoading || updateLoading}
              >
                {(isLoading || updateLoading) && (
                  <Spinner size="sm" className="me-2" />
                )}
                {isLoading || updateLoading ? "Submitting..." : "Submit"}
              </Button>
              <Button
                type="reset"
                className="w-20"
                color="dark"
                outline
                onClick={onDiscard}
              >
                Close
              </Button>
            </Col>
          </ModalFooter>
        </Form>
      </Modal>
    </Fragment>
  );
};

export default InvoiceModal;
