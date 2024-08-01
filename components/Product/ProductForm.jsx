"use client";

import { yupResolver } from "@hookform/resolvers/yup";

import { useQuery } from "@tanstack/react-query";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import {
  ProductCategoryApi,
  ProductsApi,
  SuppliersApi,
  UsersAPI,
} from "common/utils/axios/api";
import request from "common/utils/axios/index";
import { useRouter } from "next/navigation";
import { Fragment, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  Button,
  Card,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Spinner,
} from "reactstrap";
import * as yup from "yup";
import { getUserData } from "common/utils";
const fetchSuppliers = async () => {
  const response = await request({
    method: "GET",
    url: SuppliersApi,
  });
  return response.data;
};

const fetchProductCategories = async () => {
  const response = await request({
    method: "GET",
    url: ProductCategoryApi,
  });
  return response.data;
};

const fetchUsers = async () => {
  const response = await request({
    method: "GET",
    url: UsersAPI,
  });
  return response.data;
};

const useSuppliers = () => {
  return useQuery({
    queryKey: "suppliers",
    queryFn: fetchSuppliers,
  });
};

const useProductCategories = () => {
  return useQuery({
    queryKey: "productCategories",
    queryFn: fetchProductCategories,
  });
};

const useUsers = () => {
  return useQuery({
    queryKey: "users",
    queryFn: fetchUsers,
  });
};

const schema = yup.object().shape({
  name: yup.string().min(2).max(50).required("Name is required"),
  quantity: yup.number().min(1).required("Quantity is required"),
  price: yup.number().min(1).required("Price is required"),
  expireDate: yup.date().required("Expire Date is required"),
  description: yup.string().nullable(),
  cost: yup.number().min(1).required("Cost is required"),
  profilePicture: yup.string().nullable(),
  category: yup.string().required("Category is required"),
  supplier: yup.string().required("Supplier is required"),
  brand: yup.string().required("Brand is required").oneOf(["New", "Old"]),
});

const defaultValues = {
  name: "",
  quantity: 0,
  price: 0,
  description: "",
  cost: 0,
  profilePicture: "",
  category: "",
  supplier: "",
  expireDate: "",
  brand: "New",
  createdBy: "65fe91208f8240812e267742",
};

const ProductsRegistrationForm = ({ id = null }) => {
  const router = useRouter();
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { data: suppliersData } = useSuppliers();
  const { data: productCategories } = useProductCategories();
  const { data: usersData } = useUsers();

  const suppliersOptions = suppliersData?.data?.docs?.map((supplier) => ({
    value: supplier._id,
    label: supplier.SupplierName,
  }));
  const categoriesOptions = productCategories?.data?.docs?.map((category) => ({
    value: category._id,
    label: category.name,
  }));
  const usersOptions = usersData?.data?.docs?.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  const { mutate, isPending: isLoading } = useCreate(
    ProductsApi,
    "Product Created Successfully",
    () => {
      onDiscard();
    }
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    ProductsApi,
    false,
    () => {
      onDiscard();
    }
  );

  const userData = getUserData();
  const branch = userData?.res?.branch
  const createdBy = userData?.res?._id
  console.log(userData)
  useEffect(() => {
    if (id) {
      // Fetch product details and populate form
      const fetchProduct = async () => {
        const response = await request({
          method: "GET",
          url: `${ProductsApi}/${id}`,
        });
        const product = response.data;
        reset(product?.data);
      };
      fetchProduct();
    }
  }, [id, reset]);

  const onSubmit = (data) => {
    const validation = schema.validate(data, { abortEarly: false });
    if (validation.error) {
      const newErrors = {};
      validation.error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      return;
    }

    // Convert expireDate to the appropriate date format
    const formattedData = {
      ...data,
      expireDate: new Date(data.expireDate),
      branch,
      createdBy // Convert to Date object
    };

    if (id) {
      console.log(id);
      mutateUpdate({ updateId: id, data: formattedData });
    } else {
      mutate(formattedData);
    }
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setValue("profilePicture", reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase64(file);
  };

  const onDiscard = () => {
    router.replace("/dashboard/products");
  };

  return (
    <Fragment>
      <Card className="m-4 p-4">
        <h4 className="mb-4">Product Form</h4>
        <Form onSubmit={handleSubmit(onSubmit)} className="">
          <Row>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="name">
                Product Name
              </Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Name"
                    invalid={!!errors.name}
                  />
                )}
              />
              {errors.name && (
                <FormFeedback>{errors.name.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="category">
                Category
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={categoriesOptions}
                    value={categoriesOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selected) => field.onChange(selected.value)}
                  />
                )}
              />
              {errors.category && (
                <FormFeedback>{errors.category.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="supplier">
                Supplier
              </Label>
              <Controller
                name="supplier"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={suppliersOptions}
                    value={suppliersOptions?.find(
                      (option) => option.value === field.value
                    )}
                    onChange={(selected) => field.onChange(selected.value)}
                  />
                )}
              />
              {errors.supplier && (
                <FormFeedback>{errors.supplier.message}</FormFeedback>
              )}
            </Col>

            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="brand">
                Brand
              </Label>
              <Controller
                name="brand"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="select"
                    id="brand"
                    invalid={!!errors.brand}
                  >
                    <option value="New">New</option>
                    <option value="Old">Old</option>
                  </Input>
                )}
              />
              {errors.brand && (
                <FormFeedback>{errors.brand.message}</FormFeedback>
              )}
            </Col>
            <Col md={4} sm={12} className="mb-2">
              <Label className="form-label" for="quantity">
                Quantity
              </Label>
              <Controller
                name="quantity"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="quantity"
                    placeholder="Quantity"
                    invalid={!!errors.quantity}
                  />
                )}
              />
              {errors.quantity && (
                <FormFeedback>{errors.quantity.message}</FormFeedback>
              )}
            </Col>
            <Col md={4} sm={12} className="mb-2">
              <Label className="form-label" for="price">
                Price
              </Label>
              <Controller
                name="price"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="price"
                    placeholder="Price"
                    invalid={!!errors.price}
                  />
                )}
              />
              {errors.price && (
                <FormFeedback>{errors.price.message}</FormFeedback>
              )}
            </Col>
            <Col md={4} sm={12} className="mb-2">
              <Label className="form-label" for="cost">
                Cost
              </Label>
              <Controller
                name="cost"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    id="cost"
                    placeholder="Cost"
                    invalid={!!errors.cost}
                  />
                )}
              />
              {errors.cost && (
                <FormFeedback>{errors.cost.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="expireDate">
                Expiry Date
              </Label>
              <Controller
                name="expireDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    id="expireDate"
                    invalid={!!errors.expireDate}
                  />
                )}
              />
              {errors.expireDate && (
                <FormFeedback>{errors.expireDate.message}</FormFeedback>
              )}
            </Col>

            <Col md={12} sm={12} className="mb-2">
              <Label className="form-label" for="description">
                Description
              </Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="textarea"
                    id="description"
                    placeholder="Description"
                    invalid={!!errors.description}
                  />
                )}
              />
              {errors.description && (
                <FormFeedback>{errors.description.message}</FormFeedback>
              )}
            </Col>
            <Col md={4} lg={4} sm={12} className="mb-2">
              <Label className="form-label" for="profilePicture">
                Profile Picture
              </Label>
              <Controller
                name="profilePicture"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="file"
                    id="profilePicture"
                    onChange={handleImage}
                  />
                )}
              />
              {errors.profilePicture && (
                <FormFeedback>{errors.profilePicture.message}</FormFeedback>
              )}
            </Col>
          </Row>

          <div className="float-end d-flex flex-col gap-2 gap-2">
            <Button
              type="reset"
              className="w-20"
              color="dark"
              outline
              onClick={onDiscard}
            >
              Close
            </Button>
            <Button
              color="primary"
              type="submit"
              disabled={isLoading || updateLoading}
            >
              {isLoading || updateLoading ? (
                <>
                  <Spinner size="sm" /> Saving
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </Form>
      </Card>
    </Fragment>
  );
};

export default ProductsRegistrationForm;
