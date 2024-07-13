import { Fragment, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import { ExpensesApi } from "common/utils/axios/api";
import useUpdate from "hooks/useUpdate";

// validation schema
const schema = Joi.object({
  method: Joi.string().label("method"),
});

// component
const ExpenseModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const defaultValues = {
    method: selectedRow?.method || "",
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

  const { mutate: mutateUpdate, isPending: payLoading } = useUpdate(
    `${ExpensesApi}/pay`,
    "Expense Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
      reset(defaultValues);
    }
  );

  const onSubmit = (data) => {
    console.log("selected Row : ", selectedRow);
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
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
        ...defaultValues,
        method: selectedRow?.method || "you",
      });
    }
  }, [selectedRow]);

  return (
    <Fragment>
      <Modal isOpen={showModal} onClosed={onDiscard} toggle={toggleModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            Make Payment
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
              <Col xs={12} md={12} lg={12} className="mb-2">
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
                      defaultValue={selectedRow ? selectedRow?.method : ""}
                    >
                      <option value="">Select Payment Method</option>
                      <option value="cash">Cash</option>
                      <option value="evc">EVC Plus</option>
                      <option value="bank">Bank</option>
                    </Input>
                  )}
                />
                {errors.method && (
                  <FormFeedback>{errors.method.message}</FormFeedback>
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
                disabled={payLoading}
              >
                {payLoading && <Spinner size="sm" className="me-2" />}
                {payLoading ? "Submitting..." : "Submit"}
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

export default ExpenseModal;
