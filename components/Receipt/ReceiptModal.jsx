import { Fragment, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "common/utils/axios/index";
import Select from 'react-select';
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
import {
  ReceiptsApi,
  InvoicesApi,
  CustomersApi,
} from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

const schema = Joi.object({
  customerId: Joi.any().optional().label("Customer"),
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

const fetchInvoices = async (customerId) => {
  console.log(customerId)
  const response = await request({
    method: "GET",
    url: `${InvoicesApi}/single/${customerId}`,
  });
  return response.data;
};

const useCustomers = () => {
  return useQuery({
    queryKey: "customers",
    queryFn: fetchCustomers,
  });
};

// component
const ReceiptsModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();
  const { data: customerData } = useCustomers();
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const Customeroptions = customerData?.data?.docs?.map((customer) => ({
    value: customer._id,
    label: customer.fullName,
  }));

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
  
  const customerId = useWatch({ control, name: "customerId" });
  const invoiceId = useWatch({ control, name: "invoiceId" });
  const amount = useWatch({ control, name: "amount" });

  useEffect(() => {
    if (customerId?.value) {
      fetchInvoices(customerId.value).then(data => {
        const invoices = data?.data?.docs?.filter(invoice => 
          invoice.totalAmount - (invoice.paidAmount || 0) > 0
        );
        setFilteredInvoices(invoices);
      });
    } else {
      setFilteredInvoices([]);
    }
  }, [customerId]);

  const selectedInvoice = filteredInvoices?.find(
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
    // Check if customerId is selected
    if (!data.customerId || !data.customerId.value) {
      setError("customerId", {
        type: "manual",
        message: "Customer is required",
      });
      return;
    }

    const receiptData = {
      ...data,
      customerId: data.customerId.value,  // Extract the value from react-select
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
        customerId: Customeroptions.find(option => option.value === selectedRow?.customerId) || "",
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
  }, [selectedRow, reset, Customeroptions]);

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
                    <Select
                      id="customer"
                      {...field}
                      options={Customeroptions}
                      defaultValue={selectedRow ? Customeroptions.find(option => option.value === selectedRow.customerId) : null}
                      classNamePrefix={errors.customerId ? 'is-invalid' : ''}
                    />
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
                  Invoice No
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
                      defaultValue={selectedRow ? selectedRow?.invoiceId : ""}
                    >
                      <option value="">Select Invoice</option>
                      {filteredInvoices?.map((invoice) => (
                        <option key={invoice._id} value={invoice._id}>
                          {invoice?.invoiceNo}
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

export default ReceiptsModal;
