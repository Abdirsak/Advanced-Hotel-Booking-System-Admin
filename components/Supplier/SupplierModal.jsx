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
import { SuppliersApi } from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";

//validation schema
const schema = Joi.object({
  SupplierName: Joi.string().min(2).max(20).required().label("SupplierName"),
  phone: Joi.string().required().label("phone"),
  address: Joi.string().label("address"),
  email: Joi.string().min(2).max(20).required().label("email"),
  country: Joi.string().required().label("country"),
  description: Joi.string().label("description"),
});

//component
const SupplierModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    SupplierName: selectedRow?.SupplierName || "",
    phone: selectedRow?.phone || "",
    address: selectedRow?.address || "",
    email: selectedRow?.email || "",
    country: selectedRow?.country || "",
    description: selectedRow?.description || "",
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

  const { mutate, isPending: isLoading } = useCreate(
    SuppliersApi,
    "New Supplier Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    SuppliersApi,
    "New Supplier Updated Successfully",
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
     console.log(data)
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
        SupplierName: selectedRow?.SupplierName || "",
        description: selectedRow?.description || "",
        phone: selectedRow?.phone || "",
        address: selectedRow?.address || "",
        email: selectedRow?.email || "",
        country: selectedRow?.country || "",
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
              <Col xs={12} md={12} lg={12} className="mb-2">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Controller
                  name="SupplierName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="SupplierName"
                      placeholder="SupplierName"
                      {...register(
                        "SupplierName",
                        { required: true },
                        "SupplierName is required"
                      )}
                      invalid={errors.SupplierName && true}
                      {...field}
                    />
                  )}
                />
                {errors.SupplierName && (
                  <FormFeedback>{errors.SupplierName.message}</FormFeedback>
                )}
              </Col>
              </Row>
              <Row>
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="phone">
                  Phone
                </Label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="phone"
                      placeholder="phone"
                      {...register(
                        "phone",
                        { required: true },
                        "phone is required"
                      )}
                      invalid={errors.phone && true}
                      {...field}
                    />
                  )}
                />
                {errors.phone && (
                  <FormFeedback>{errors.phone.message}</FormFeedback>
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
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="email">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      placeholder="email"
                      {...register(
                        "email",
                        { required: true },
                        "email is required"
                      )}
                      invalid={errors.email && true}
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <FormFeedback>{errors.email.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={6} lg={6}  className="mb-2">
                <Label className="form-label" for="country">
                  Country
                </Label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="country"
                      type="select"
                      {...register("country")}
                      invalid={errors.country && true}
                      {...field}
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country.value} value={country.value}>
                          {country.label}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.department && (
                  <FormFeedback>{errors.department.message}</FormFeedback>
                )}
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

export default SupplierModal;
