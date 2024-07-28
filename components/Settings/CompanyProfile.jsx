"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Fragment, useEffect, useState } from "react";
import {
  Card,
  Col,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  Button,
  Spinner,
} from "reactstrap";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import useCreate from "hooks/useCreate";
import { CompanyProfileApi } from "common/utils/axios/api";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios";

const schema = yup.object().shape({
  name: yup.string().min(2).max(50).required("Name is required"),
  logo: yup.mixed().required("Logo is required"),
  currency: yup.string().required("Currency is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  phone: yup.string().required("Phone is required"),
});

const defaultValues = {
  name: "",
  logo: "",
  currency: "",
  address: "",
  city: "",
  country: "",
  phone: "",
};

const CompanyInfoForm = () => {
  const {
    data,
    isLoading: loading,
    refetch,
  } = useQuery({
    queryKey: [CompanyProfileApi],
    queryFn: () =>
      request({
        url: CompanyProfileApi,
        method: "GET",
      }),
    select: (res) => res.data,
  });

  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [file, setFile] = useState(null);
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { mutate, isPending: isLoading } = useCreate(
    CompanyProfileApi, // API endpoint to save the company info
    "Company Info Saved Successfully",
    () => {
      onDiscard();
    }
  );

  const onSubmit = (data) => {
    const validation = schema.validate(data, { abortEarly: false });

    if (validation.error) {
      const newErrors = {};
      validation.error.details.forEach((err) => {
        newErrors[err.path[0]] = err.message;
      });
      return;
    }

    const formData = new FormData();
    for (const key in data) {
      if (key === "logo" && data.logo instanceof File) {
        formData.append(key, data.logo);
      } else {
        formData.append(key, data[key]);
      }
    }

    formData.set("logo", file);

    mutate(formData);
  };

  const setFileToBase64 = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(file);
      setImagePreview(reader.result);
    };
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setFileToBase64(file);
  };

  const onDiscard = () => {
    // router.replace("/dashboard");
  };

  useEffect(() => {
    console.log("uuuu");
    reset({
      ...data,
      logo: "",
    });

    console.log(data?.logoUrl);
    setImagePreview(data?.logoUrl);
  }, [data]);

  return (
    <Fragment>
      <Card className="m-4 p-4">
        <h4 className="mb-4">Company Info</h4>
        <Form onSubmit={handleSubmit(onSubmit)} className="">
          <Row>
            <Col md={12} sm={12} className="mb-2">
              <Label className="form-label" for="name">
                Name
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
              <Label className="form-label" for="logo">
                Logo
              </Label>
              <Controller
                name="logo"
                control={control}
                render={({ field }) => (
                  <Fragment>
                    <Input
                      {...field}
                      type="file"
                      id="logo"
                      onChange={handleImage}
                      invalid={!!errors.logo}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Logo Preview"
                        className="mt-2"
                        style={{ maxWidth: "200px", maxHeight: "200px" }}
                      />
                    )}
                  </Fragment>
                )}
              />
              {errors.logo && (
                <FormFeedback>{errors.logo.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="currency">
                Currency
              </Label>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="currency"
                    placeholder="Currency"
                    invalid={!!errors.currency}
                  />
                )}
              />
              {errors.currency && (
                <FormFeedback>{errors.currency.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="address">
                Address
              </Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="address"
                    placeholder="Address"
                    invalid={!!errors.address}
                  />
                )}
              />
              {errors.address && (
                <FormFeedback>{errors.address.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="city">
                City
              </Label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="city"
                    placeholder="City"
                    invalid={!!errors.city}
                  />
                )}
              />
              {errors.city && (
                <FormFeedback>{errors.city.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="country">
                Country
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="country"
                    placeholder="Country"
                    invalid={!!errors.country}
                  />
                )}
              />
              {errors.country && (
                <FormFeedback>{errors.country.message}</FormFeedback>
              )}
            </Col>
            <Col md={6} sm={12} className="mb-2">
              <Label className="form-label" for="phone">
                Phone
              </Label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    placeholder="Phone"
                    invalid={!!errors.phone}
                  />
                )}
              />
              {errors.phone && (
                <FormFeedback>{errors.phone.message}</FormFeedback>
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
            <Button color="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
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

export default CompanyInfoForm;
