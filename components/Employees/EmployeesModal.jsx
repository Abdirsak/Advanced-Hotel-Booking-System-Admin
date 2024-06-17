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
import { BranchesApi, EmployeesApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";

// validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(20).required().label("Name"),
  contact: Joi.string().required().label("Contact"),
  address: Joi.string().required().label("Address"),
  workingHours: Joi.object({
    from: Joi.string().required().label("From"),
    to: Joi.string().required().label("To"),
  }).required(),
  director: Joi.string().required().label("Director")
});

const fetchEmployees = async () => {
  const response = await request({
    method: 'GET',
    url: EmployeesApi,
  });
  return response.data;
};

const useEmployees = () => {
  return useQuery({
    queryKey: 'employees',
    queryFn: fetchEmployees,
  });
};

// component
const EmployeesModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const queryClient = useQueryClient();
  const { data: employeesData } = useEmployees();

  const defaultValues = {
    name: selectedRow?.name || "",
    contact: selectedRow?.contact || "",
    address: selectedRow?.address || "",
    workingHours: {
      from: selectedRow?.workingHours?.from || "",
      to: selectedRow?.workingHours?.to || "",
    },
    director: selectedRow?.director?._id || ""
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
    BranchesApi,
    "Branch Created Successfully",
    
    () => {
        setShowModal(false);
      }
    
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    BranchesApi,
    "Branch Updated Successfully",
  () => {
        setShowModal(false);
        setSelectedRow(null);
      
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
    reset();
    setShowModal(false);
    setSelectedRow(null)
    setSelectedRow(defaultValues)
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
        contact: selectedRow?.contact || "",
        address: selectedRow?.address || "",
        workingHours: {
          from: selectedRow?.workingHours?.from || "",
          to: selectedRow?.workingHours?.to || "",
        },
        director: selectedRow?.director?._id || "",
      });
    }
  }, [selectedRow]);

  return (
    <Fragment>
      <Modal isOpen={showModal} onClosed={onDiscard} toggle={toggleModal} size="lg">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Branch" : "Update Branch"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="name">
                  Name
                </Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      placeholder="Name"
                      {...register("name")}
                      invalid={errors.name && true}
                      {...field}
                    />
                  )}
                />
                {errors.name && (
                  <FormFeedback>{errors.name.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
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
              <Col xs={4} className="mb-2">
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
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="workingHours.from">
                  Working Hours From
                </Label>
                <Controller
                  name="workingHours.from"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="workingHours.from"
                      placeholder="From"
                      {...register("workingHours.from")}
                      invalid={errors.workingHours?.from && true}
                      {...field}
                    />
                  )}
                />
                {errors.workingHours?.from && (
                  <FormFeedback>{errors.workingHours.from.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="workingHours.to">
                  Working Hours To
                </Label>
                <Controller
                  name="workingHours.to"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="workingHours.to"
                      placeholder="To"
                      {...register("workingHours.to")}
                      invalid={errors.workingHours?.to && true}
                      {...field}
                    />
                  )}
                />
                {errors.workingHours?.to && (
                  <FormFeedback>{errors.workingHours.to.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="director">
                  Director
                </Label>
                <Controller
                  name="director"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="director"
                      type="select"
                      {...register("director")}
                      invalid={errors.director && true}
                      {...field}
                      defaultValue={selectedRow ? selectedRow?.director?._id : ""}
                    >
                      <option value="">Select Director</option>
                      {employeesData?.data?.docs?.map((employee) => (
                        <option key={employee._id} value={employee._id}>
                          {employee?.fullName}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.director && (
                  <FormFeedback>{errors.director.message}</FormFeedback>
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

export default EmployeesModal;
