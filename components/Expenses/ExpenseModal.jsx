import { Fragment, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios/index";
import { getUserData } from "common/utils";
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
import { ExpenseCategoryApi, ExpensesApi } from "common/utils/axios/api";
import useCreate from "hooks/useCreate";
import useUpdate from "hooks/useUpdate";
import moment from "moment";

// validation schema
const schema = Joi.object({
  description: Joi.string().min(2).max(50).required().label("description"),
  date: Joi.date().required().label("date"),
  amount: Joi.number().required().label("amount"),
  category: Joi.string().allow(null).label("category"),
});

const fetchCategories = async () => {
  const response = await request({
    method: "GET",
    url: ExpenseCategoryApi,
  });
  return response.data;
};

const useCategories = () => {
  return useQuery({
    queryKey: "expenseCategories",
    queryFn: fetchCategories,
  });
};

// component
const CategoryModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const { data: categoryData } = useCategories();
  console.log(selectedRow);
  const defaultValues = {
    date: selectedRow?.date || moment().format("YYYY-MM-DD"),
    description: selectedRow?.description || "",
    amount: selectedRow?.amount || 0,
    category: selectedRow?.category || "",
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
    ExpensesApi,
    "Expense Created Successfully",
    () => {
      setShowModal(false);
      reset(defaultValues);
    }
  );

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ExpensesApi,
    "Expense Updated Successfully",
    () => {
      setShowModal(false);
      setSelectedRow(null);
      reset(defaultValues);
    }
  );
  const userData = getUserData();
  const branch = userData?.res?.branch
  const createdBy = userData?.res?._id
  // console.log(userData)
  const onSubmit = (data) => {
    console.log("data is :", data);
    const updatedData = { ...data,branch };
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
        ...defaultValues,
        date:
          moment(selectedRow?.date).format("YYYY-MM-DD") ||
          moment().format("YYYY-MM-DD"),
        description: selectedRow?.description || "",
        amount: selectedRow?.amount || 0,
        category: selectedRow?.category._id || "",
      });
    }
  }, [selectedRow]);

  return (
    <Fragment>
      <Modal isOpen={showModal} onClosed={onDiscard} toggle={toggleModal}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Expense" : "Update Expense"}
          </ModalHeader>
          <ModalBody>
            <Row className="justify-content-center">
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

              <Col xs={12} md={12} lg={12} className="mb-2">
                <Label className="form-label" for="date">
                  Date
                </Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="date"
                      type="date"
                      placeholder="Date"
                      {...register("date")}
                      invalid={errors.date && true}
                      {...field}
                    />
                  )}
                />
                {errors.date && (
                  <FormFeedback>{errors.date.message}</FormFeedback>
                )}
              </Col>
              <Col xs={12} md={12} lg={12} className="mb-2">
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

              <Col xs={12} md={12} lg={12} className="mb-2">
                <Label className="form-label" for="category">
                  Category
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="category"
                      type="select"
                      {...register("category")}
                      invalid={errors.category && true}
                      {...field}
                      defaultValue={selectedRow ? selectedRow?.category : ""}
                    >
                      <option value="">Select Category</option>
                      {categoryData?.data?.docs?.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category?.name}
                        </option>
                      ))}
                    </Input>
                  )}
                />
                {errors.category && (
                  <FormFeedback>{errors.category.message}</FormFeedback>
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

export default CategoryModal;
