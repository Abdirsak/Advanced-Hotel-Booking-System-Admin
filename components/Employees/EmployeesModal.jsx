import { Fragment, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import request from "common/utils/axios/index";

// 3rd party packages
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

import { RolesApi } from "common/utils/axios/api";

// custom packages
import { EmployeesApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

// validation schema
const schema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().label("Full Name"),
  username: Joi.string().min(3).max(30).required().label("Username"),
  password: Joi.string().min(6).required().label("Password"),
  dateOfBirth: Joi.date().required().label("Date of Birth"),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .required()
    .label("Gender"),
  contact: Joi.string().required().label("Contact"),
  address: Joi.string().required().label("Address"),
  position: Joi.string().required().label("Position"),
  hiringDate: Joi.date().required().label("Hiring Date"),
  salary: Joi.number().required().label("Salary"),
  role: Joi.string().allow(null).label("Role"),
  emergencyContact: Joi.string().required().label("Emergency Contact"),
});

const fetchRoles = async () => {
  const response = await request({
    method: 'GET',
    url: RolesApi,
  });
  return response.data;
};

const positions = [
  { value: "cleaner", label: "Cleaner" },
  { value: "reception", label: "Reception" },
  { value: "guard", label: "Guard" },
];

const useRoles = () => {
  return useQuery({
    queryKey: 'roles',
    queryFn: fetchRoles,
  });
};

// component
const EmployeeModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();

  const { data: rolesData } = useRoles();

  const defaultValues = {
    fullName: "",
    username: "",
    password: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    address: "",
    position: "",
    hiringDate: "",
    salary: "",
    role: null,
    emergencyContact: "",
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
    EmployeesApi,
    "Employee Created Successfully",
    () => {
      setShowModal(false);
      reset(defaultValues);
    }
  );

  console.log("Errors : ",errors)

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    EmployeesApi,
    "Employee Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
      reset(defaultValues);
    }
  );

  const onSubmit = (data) => {
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      mutate(data);
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
        fullName: selectedRow?.fullName || "",
        username: selectedRow?.username || "",
        password: selectedRow?.password || "",
        dateOfBirth: selectedRow?.dateOfBirth?.split("T")[0] || "" || "",
        gender: selectedRow?.gender || "",
        contact: selectedRow?.contact || "",
        address: selectedRow?.address || "",
        position: selectedRow?.position || "",
        hiringDate: selectedRow?.hiringDate?.split("T")[0] || "" || "",
        salary: selectedRow?.salary || "",
        role: selectedRow?.role || null,
        emergencyContact: selectedRow?.emergencyContact || "",
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
            {!selectedRow ? "New Employee" : "Update Employee"}
          </ModalHeader>
          <ModalBody>
            <Row className="">
              <Col xs={12} md={12} lg={6} className="mb-2">
                <Label className="form-label" for="fullName">
                  Full Name
                </Label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fullName"
                      placeholder="Full Name"
                      {...register("fullName")}
                      invalid={errors.fullName && true}
                      {...field}
                    />
                  )}
                />
                {errors.fullName && (
                  <FormFeedback>{errors.fullName.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
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
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="dateOfBirth">
                  Date of Birth
                </Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="dateOfBirth"
                      type="date"
                      placeholder="Date of Birth"
                      {...register("dateOfBirth")}
                      invalid={errors.dateOfBirth && true}
                      {...field}
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <FormFeedback>{errors.dateOfBirth.message}</FormFeedback>
                )}
              </Col>

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
                      placeholder="Contact"
                      {...register("contact")}
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
                <Label className="form-label" for="emergencyContact">
                  Emergency Contact
                </Label>
                <Controller
                  name="emergencyContact"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="emergencyContact"
                      placeholder="Emergency Contact"
                      {...register("emergencyContact")}
                      invalid={errors.emergencyContact && true}
                      {...field}
                    />
                  )}
                />
                {errors.emergencyContact && (
                  <FormFeedback>{errors.emergencyContact.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={12} lg={6} className="mb-2">
                <Label className="form-label" for="address">
                  Address
                </Label>
                <Controller
                  name="address"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="address"
                      placeholder="Address"
                      {...register("address")}
                      invalid={errors.address && true}
                      {...field}
                    />
                  )}
                />
                {errors.address && (
                  <FormFeedback>{errors.address.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="hiringDate">
                  Hiring Date
                </Label>
                <Controller
                  name="hiringDate"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="hiringDate"
                      type="date"
                      placeholder="Hiring Date"
                      {...register("hiringDate")}
                      invalid={errors.hiringDate && true}
                      {...field}
                    />
                  )}
                />
                {errors.hiringDate && (
                  <FormFeedback>{errors.hiringDate.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="salary">
                  Salary
                </Label>
                <Controller
                  name="salary"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="salary"
                      type="number"
                      placeholder="Salary"
                      {...register("salary")}
                      invalid={errors.salary && true}
                      {...field}
                    />
                  )}
                />
                {errors.salary && (
                  <FormFeedback>{errors.salary.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="username">
                  Username
                </Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="username"
                      placeholder="Username"
                      {...register("username")}
                      invalid={errors.username && true}
                      {...field}
                    />
                  )}
                />
                {errors.username && (
                  <FormFeedback>{errors.username.message}</FormFeedback>
                )}
              </Col>

              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="password">
                  Password
                </Label>
                <div className="d-flex">
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="password"
                        placeholder="Password"
                        type="text"
                        {...register("password")}
                        invalid={errors.password && true}
                        {...field}
                      />
                    )}
                  />
                  <Button
                    color="primary"
                    className="ms-1"
                    onClick={() => {
                      const generated = Math.random().toString(36).slice(-6);
                      reset({ ...control._formValues, password: generated });
                    }}
                  >
                    Generate
                  </Button>
                </div>
                {errors.password && (
                  <FormFeedback>{errors.password.message}</FormFeedback>
                )}
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6} lg={6} className="mb-2">
                <Label className="form-label" for="position">
                  Position
                </Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="position"
                      type="select"
                      {...register("position")}
                      invalid={errors.position && true}
                      {...field}
                    >
                      <option value="">Select Position</option>
                      {positions.map((pos) => (
                        <option key={pos.value} value={pos.value}>
                          {pos.label}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.position && (
                  <FormFeedback>{errors.position.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={12} lg={6} className="mb-2">
                <Label className="form-label" for="role">
                  Role
                </Label>
                <Controller
                  name="role"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="role"
                      type="select"
                      {...register("role")}
                      invalid={errors.role && true}
                      {...field}
                      defaultValue={selectedRow ? selectedRow?.role : ""}
                    >
                      <option value="">Select Role</option>
                      {rolesData?.data?.map((role) => (
                        <option key={role._id} value={role._id}>
                          {role?.name}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.role && (
                  <FormFeedback>{errors.role.message}</FormFeedback>
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

export default EmployeeModal;
