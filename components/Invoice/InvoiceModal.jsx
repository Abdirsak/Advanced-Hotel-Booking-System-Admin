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

// custom packages
import { EmployeesApi, UsersAPI } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

// validation schema
const schema = Joi.object({
  fullName: Joi.string().min(2).max(50).required().label("Full Name"),
  dateOfBirth: Joi.date().required().label("Date of Birth"),
  gender: Joi.string().valid("Male", "Female", "Other").required().label("Gender"),
  contact: Joi.string().required().label("Contact"),
  address: Joi.string().required().label("Address"),
  position: Joi.string().required().label("Position"),
  department: Joi.string().required().label("Department"),
  hiringDate: Joi.date().required().label("Hiring Date"),
  salary: Joi.number().required().label("Salary"),
  emergencyContact: Joi.string().required().label("Emergency Contact"),
  user: Joi.string().allow(null).label("User")
});

const fetchUsers = async () => {
  const response = await request({
    method: 'GET',
    url: UsersAPI,
  });
  return response.data;
};

const fetchEmployees = async () => {
  const response = await request({
    method: 'GET',
    url: EmployeesApi,
  });
  return response.data;
};

const useUsers = () => {
  return useQuery({
    queryKey: 'users',
    queryFn: fetchUsers,
  });
};

const useEmployees = () => {
  return useQuery({
    queryKey: 'employees',
    queryFn: fetchEmployees,
  });
};

const positions = [
  { value: "Developer", label: "Developer" },
  { value: "Manager", label: "Manager" },
  { value: "Designer", label: "Designer" },
  // Add other positions as needed
];

const departments = [
  { value: "IT", label: "IT" },
  { value: "HR", label: "HR" },
  { value: "Marketing", label: "Marketing" },
  // Add other departments as needed
];

// component
const EmployeeModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();
  const { data: usersData } = useUsers();
  console.log(selectedRow)
  const defaultValues = {
    fullName: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    address: "",
    position: "",
    department: "",
    hiringDate: "",
    salary: "",
    emergencyContact: "",
    user: null
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
        dateOfBirth: selectedRow?.dateOfBirth?.split("T")[0] || "" || "",
        gender: selectedRow?.gender || "",
        contact: selectedRow?.contact || "",
        address: selectedRow?.address || "",
        position: selectedRow?.position || "",
        department: selectedRow?.department || "",
        hiringDate: selectedRow?.hiringDate?.split("T")[0] || "" || "",
        salary: selectedRow?.salary || "",
        emergencyContact: selectedRow?.emergencyContact || "",
        user: selectedRow?.user?._id || null,
      });
    }
  }, [selectedRow, reset]);

  return (
    <Fragment>
      <Modal isOpen={showModal} onClosed={onDiscard} toggle={toggleModal} size="lg">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Employee" : "Update Employee"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} md={8} lg={8} className="mb-2">
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
              <Col xs={12} md={6} lg={4} className="mb-2">
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
              <Col xs={12} md={6} lg={4} className="mb-2">
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
              <Col xs={12} md={6} lg={4} className="mb-2">
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
             
              </Row>
              <Row>
    <Col xs={12} md={6} lg={4} className="mb-2">
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
    <Col xs={12} md={6} lg={4} className="mb-2">
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
    <Col xs={12} md={6} lg={4} className="mb-2">
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
  </Row>
              <Row>
              <Col xs={12} md={6} lg={4} className="mb-2">
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
              <Col xs={12} md={6} lg={4} className="mb-2">
                <Label className="form-label" for="department">
                  Department
                </Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="department"
                      type="select"
                      {...register("department")}
                      invalid={errors.department && true}
                      {...field}
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.value} value={dept.value}>
                          {dept.label}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.department && (
                  <FormFeedback>{errors.department.message}</FormFeedback>
                )}
              </Col>
             
              <Col xs={12} md={6} lg={4} className="mb-2">
                <Label className="form-label" for="user">
                  User
                </Label>
                <Controller
                  name="user"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="user"
                      type="select"
                      {...register("user")}
                      invalid={errors.user && true}
                      {...field}
                      defaultValue={selectedRow ? selectedRow?.user?._id : ""}
                    >
                      <option value="">Select User</option>
                      {usersData?.data?.docs?.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user?.fullName}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.user && (
                  <FormFeedback>{errors.user.message}</FormFeedback>
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
