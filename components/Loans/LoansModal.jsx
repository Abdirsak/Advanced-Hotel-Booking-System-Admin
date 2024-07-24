import { Fragment, useEffect } from "react";

//3rd party packages
import Joi from "joi";
import { Controller, useForm } from "react-hook-form";
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

//custom packages
import { LoansApi } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(50).required().label("Name"),
  contact: Joi.string().required().label("contact"),
  address: Joi.string().label("address"),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required()
    .label("Gender"),
  description: Joi.string().label("description"),
  startDate: Joi.date().required().label("Start Date"),
  endDate: Joi.date().required().label("End Date"),
  amount: Joi.number().required().label("Amount"),
  returnedAmount: Joi.number().allow(null).label("Returned Amount"),
});

//component
const LoansModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    name: selectedRow?.name || "",
    contact: selectedRow?.contact || "",
    address: selectedRow?.address || "",
    gender: selectedRow?.gender || "",
    description: selectedRow?.description || "",
    startDate: selectedRow?.startDate || "",
    endDate: selectedRow?.endDate || "",
    amount: selectedRow?.amount || 0,
    returnedAmount: selectedRow?.returnedAmount || 0,
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
  const { mutate, isPending: isLoading } = useCreate(
    LoansApi,
    "New Loan Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    LoansApi,
    "Loan Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
    }
  );
  const countries = [
    { value: "Somalia", label: "Somalia" },
    { value: "China", label: "China" },
    { value: "UAE", label: "UAE" },
    // Add other countries as needed
  ];
  const onSubmit = (data) => {
    console.log(data);
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      // console.log(data)
      mutate(data);
    }
  };

  const onDiscard = () => {
    clearErrors();
    reset();
    setShowModal(false);
    setSelectedRow && setSelectedRow();
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (selectedRow) {
      reset({
        ...defaultValues,
        name: selectedRow?.name || "",
        description: selectedRow?.description || "",
        contact: selectedRow?.contact || "",
        address: selectedRow?.address || "",
        gender: selectedRow?.gender || "",
        amount: selectedRow?.amount || 0,
        returnedAmount: selectedRow?.returnedAmount || 0,
        startDate: selectedRow?.startDate?.split("T")[0] || "" || "",
        endDate: selectedRow?.endDate?.split("T")[0] || "" || "",
      });
    }
  }, [selectedRow]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClosed={onDiscard}
        toggle={toggleModal}
        modalClassName=""
        size={"lg"}
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Supplier" : "Update Supplier"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={8} className="mb-2">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="name"
                      {...register(
                        "name",
                        { required: true },
                        "name is required"
                      )}
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={4} lg={4} className="mb-2">
                <Label className="form-label" for="gender">
                  Gender
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="gender"
                      type="select"
                      {...register("gender")}
                      invalid={errors.gender && true}
                      {...field}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </Input>
                  )}
                />
                {errors.gender && (
                  <FormFeedback>{errors.gender.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="contact">
                  Contact
                </Label>
                <Controller
                  name="contact"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="contact"
                      placeholder="contact"
                      {...register(
                        "contact",
                        { required: true },
                        "contact is required"
                      )}
                      invalid={errors.contact && true}
                      {...field}
                    />
                  )}
                />
                {errors.contact && (
                  <FormFeedback>{errors.contact.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="address">
                  Address
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="address"
                      {...register(
                        "address",
                        { required: true },
                        "address is required"
                      )}
                      invalid={errors.address && true}
                      {...field}
                    />
                  )}
                />
                {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
            <Col xs={12} md={6} lg={4} className="mb-2">
                <Label className="form-label" for="amount">
                  Amount
                </Label>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="amount"
                      placeholder="amount"
                      {...register(
                        "amount",
                        { required: true },
                        "amount is required"
                      )}
                      invalid={errors.amount && true}
                      {...field}
                    />
                  )}
                />
                {errors.amount && (
                  <FormFeedback>{errors.amount.message}</FormFeedback>
                )}
              </Col>
              {selectedRow && <Col xs={12} md={6} lg={4} className="mb-2">
                <Label className="form-label" for="returnedAmount">
                Returned Amount
                </Label>
                <Controller
                  name="returnedAmount"
                  control={control}
                  render={({ field }) => (
                    <Input
                    type="number"
                    // defaultValue={0}
                      id="returnedAmount"
                      placeholder="Returned Amount"
                      {...register(
                        "returnedAmount",
                        { required: true },
                        "Returned Amount is required"
                      )}
                      invalid={errors.returnedAmount && true}
                      {...field}
                    />
                  )}
                />
                {errors.returnedAmount && (
                  <FormFeedback>{errors.returnedAmount.message}</FormFeedback>
                )}
              </Col>
            }
              <Col xs={12} md={6} lg={4} className="mb-2">
                <Label className="form-label" for="startDate">
                  Contract Start Date
                </Label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="startDate"
                      type="date"
                      placeholder="Contract Start Date"
                      {...register("startDate")}
                      invalid={errors.startDate && true}
                      {...field}
                    />
                  )}
                />
                {errors.startDate && (
                  <FormFeedback>{errors.startDate.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={6} lg={4} className="mb-2">
                <Label className="form-label" for="endDate">
                  Contract End Date
                </Label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="endDate"
                      type="date"
                      placeholder="Contract End Date"
                      {...register("endDate")}
                      invalid={errors.endDate && true}
                      {...field}
                    />
                  )}
                />
                {errors.endDate && (
                  <FormFeedback>{errors.endDate.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row></Row>
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
                      type="textarea"
                      rows={2}
                      id="description"
                      placeholder="description"
                      {...register(
                        "description",
                        { required: true },
                        "description is required"
                      )}
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

export default LoansModal;
