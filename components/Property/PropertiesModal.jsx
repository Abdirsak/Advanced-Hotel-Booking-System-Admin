import { Fragment, useEffect, useState } from "react";

//3rd party packages
import Joi, { string } from "joi";
import { Controller, useForm } from "react-hook-form";
import SingleFileUpload from "../../common/fileUpload/SingleFileUploader";
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
import {
  PropertiesAPI,
  AgentsAPI,
  UserAPI,
  CategoryAPI,
} from "common/utils/axios/api";
import useCreate from "Hooks/useCreate";
import useUpdate from "Hooks/useUpdate";
import { useQuery } from "@tanstack/react-query";
import request from "common/utils/axios";

//validation schema
const schema = Joi.object({
  name: Joi.string().min(2).max(50).required().label("name"),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string().min(3).max(20).required().label("Password"),
  address: Joi.string().min(3).max(20).required().label("Address"),
  contactInfo: Joi.string().min(3).max(20).required().label("ContactInfo"),
  socialMedia: Joi.string().label("socialMedia"),
  about: Joi.string().label("about"),
});

//component
const PropertiesModal = ({
  showModal,
  setShowModal,
  selectedRow = null,
  setSelectedRow,
}) => {
  const [image, setImage] = useState([]);
  const defaultValues = {
    name: selectedRow?.name || "",
    slug: selectedRow?.slug || "",
    description: selectedRow?.description || "",
    owner: selectedRow?.owner?._id || "",
    type: selectedRow?.type.name || "",
    purpose: selectedRow?.purpose || "",
    price: selectedRow?.price || "",
    landArea: selectedRow?.landArea || "",
    status: selectedRow?.status || "",
    additionalInfo: selectedRow?.additionalInfo || "",
    featured: selectedRow?.featured == true ? "Yes" : "No",
    yearBuilt: selectedRow?.yearBuilt || "",
    noBathroom: selectedRow?.noBathroom || "",
    noBedroom: selectedRow?.noBedroom || "",
    noKitchen: selectedRow?.noKitchen || "",
    agent: selectedRow?.agent.name || "",
  };

  const {
    control,
    setError,
    handleSubmit,
    register,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });
  // resolver: joiResolver(schema)
  const { mutate, isPending: isLoading } = useCreate(
    PropertiesAPI,
    "Property Created Successfully",
    () => {
      setShowModal(false);
    }
  );

  const { data: Agents } = useQuery({
    queryKey: [AgentsAPI],
    queryFn: () => request({ url: AgentsAPI, method: "GET" }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    keepPreviousData: true,
    select: (res) => res?.data?.data.docs,
  });
  const { data: Owners } = useQuery({
    queryKey: [UserAPI],
    queryFn: () => request({ url: UserAPI, method: "GET" }),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: 1000 * 60 * 60,
    keepPreviousData: true,
    select: (res) => res?.data?.data.docs,
  });
  // const { data: Categories } = useQuery({
  //   queryKey: [CategoryAPI],
  //   queryFn: () => request({ url: CategoryAPI, method: "GET" }),
  //   refetchOnWindowFocus: false,
  //   refetchOnMount: false,
  //   refetchOnReconnect: false,
  //   staleTime: 1000 * 60 * 60,
  //   keepPreviousData: true,
  //   select: (res) => res?.data?.data.docs,
  // });

  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    PropertiesAPI,
    false,
    () => {
      setShowModal(false);
      setSelectedRow(null);
    }
  );

  const onSubmit = (data) => {
    data.featured = data.featured == "yes" ? true : false;
    var formdata = new FormData();

    for (const key in data) {
      formdata.append(key, data[key]);
    }

    if (image.length) {
      formdata.append(`image`, image[0], image[0].name);
    }
    if (selectedRow) {
      mutateUpdate({ data, updateId: selectedRow?._id });
    } else {
      mutate(formdata);
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
        email: selectedRow?.email || "",
        password: selectedRow?.password || "",
        address: selectedRow?.status || "",
        about: selectedRow?.about || "",
        contactInfo: selectedRow?.contactInfo || "",
        socialMedia: selectedRow?.socialMedia || {
          facebook: "facebook.com",
          twitter: "twitter.com",
          instagram: "instagram.com",
        },
      });
    }
  }, [selectedRow]);

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        size="xl"
        onClosed={onDiscard}
        toggle={toggleModal}
        modalClassName=""
      >
        <Form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader toggle={toggleModal} className="bg-white">
            {!selectedRow ? "New Property" : "Update Property"}
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
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="slug">
                  Slug
                </Label>
                <Controller
                  name="slug"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="slug"
                      placeholder="Slug"
                      {...register(
                        "slug",
                        { required: true },
                        "Slug is required"
                      )}
                      invalid={errors.slug && true}
                      {...field}
                    />
                  )}
                />
                {errors.slug && (
                  <FormFeedback>{errors.slug.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="Description">
                  Description
                </Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="description"
                      placeholder="Description"
                      {...register(
                        "description",
                        { required: true },
                        "Description is required"
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
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="owner">
                  Owner
                </Label>
                <Controller
                  name="owner"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="owner"
                      type="select"
                      placeholder="Select Owner"
                      {...register(
                        "owner",
                        { required: true },
                        "Owner is required"
                      )}
                      invalid={errors.owner && true}
                      {...field}
                    >
                      {Owners?.length && <option>--Select Owner--</option>}
                      {Owners?.map((owner) => (
                        <option value={owner?._id}>{owner?.name}</option>
                      ))}
                    </Input>
                  )}
                />
                {errors.owner && (
                  <FormFeedback>{errors.owner.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="type">
                  Type
                </Label>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="type"
                      type="select"
                      placeholder="Select Type"
                      {...register(
                        "type",
                        { required: true },
                        "Type is required"
                      )}
                      invalid={errors.type && true}
                      {...field}
                    >
                      <option value="6646e6b21226bd170cfb31e3">Villa</option>
                      <option value="6646e6aa1226bd170cfb31e0">Single</option>
                      <option value="664251cc7914b7bf5f0cac8f">Family</option>
                      <option value="6646e6b91226bd170cfb31e6">Double</option>
                      {/* {Categories?.length && (
                        <option>--Select Category--</option>
                      )}
                      {Categories?.map((category) => (
                        <option value={category._id}>{category.name}</option>
                      ))} */}
                    </Input>
                  )}
                />
                {errors.type && (
                  <FormFeedback>{errors.type.message}</FormFeedback>
                )}
              </Col>

              <Col xs={4} className="mb-2">
                <Label className="form-label" for="purpose">
                  Purpose
                </Label>
                <Controller
                  name="purpose"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="purpose"
                      placeholder="Purpose"
                      {...register(
                        "purpose",
                        { required: true },
                        "Purpose is required"
                      )}
                      invalid={errors.purpose && true}
                      {...field}
                    />
                  )}
                />
                {errors.purpose && (
                  <FormFeedback>{errors.pupose.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="price">
                  Price
                </Label>
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="price"
                      type="number"
                      placeholder="Price"
                      {...register(
                        "price",
                        { required: true },
                        "Price is required"
                      )}
                      invalid={errors.price && true}
                      {...field}
                    />
                  )}
                />
                {errors.price && (
                  <FormFeedback>{errors.price.message}</FormFeedback>
                )}
              </Col>

              <Col xs={4} className="mb-2">
                <Label className="form-label" for="landArea">
                  Land Area
                </Label>
                <Controller
                  name="landArea"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="area"
                      placeholder="Land Area"
                      {...register(
                        "landArea",
                        { required: true },
                        "Area is required"
                      )}
                      invalid={errors.landArea && true}
                      {...field}
                    />
                  )}
                />
                {errors.landArea && (
                  <FormFeedback>{errors.landArea.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="status">
                  Status
                </Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="select"
                      placeholder="Name"
                      {...register(
                        "status",
                        { required: true },
                        "Status is required"
                      )}
                      invalid={errors.status && true}
                      {...field}
                    >
                      <option value="available">Available</option>
                      <option value="booked">Booked</option>
                    </Input>
                  )}
                />
                {errors.status && (
                  <FormFeedback>{errors.status.message}</FormFeedback>
                )}
              </Col>
              <Col xs={3} className="mb-2">
                <Label className="form-label" for="yearBuilt">
                  Build Year
                </Label>
                <Controller
                  name="yearBuilt"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="yearBuilt"
                      placeholder="Year was Built"
                      {...register(
                        "yearBuilt",
                        { required: true },
                        "Year Built is required"
                      )}
                      invalid={errors.yearBuilt && true}
                      {...field}
                    />
                  )}
                />
                {errors.yearBuilt && (
                  <FormFeedback>{errors.yearBuilt.message}</FormFeedback>
                )}
              </Col>
              <Col xs={3} className="mb-2">
                <Label className="form-label" for="noBathroom">
                  No of Bathroom
                </Label>
                <Controller
                  name="noBathroom"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="noBathroom"
                      type="number"
                      placeholder="How many Batroom contain"
                      {...register(
                        "noBathroom",
                        { required: true },
                        "No Bathroom is required"
                      )}
                      invalid={errors.noBathroom && true}
                      {...field}
                    />
                  )}
                />
                {errors.noBathroom && (
                  <FormFeedback>{errors.noBathroom.message}</FormFeedback>
                )}
              </Col>
              <Col xs={3} className="mb-2">
                <Label className="form-label" for="noBedroom">
                  No of Bedroom
                </Label>
                <Controller
                  name="noBedroom"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="noBedroom"
                      type="number"
                      placeholder="How many Bedroom Contains"
                      {...register(
                        "noBedroom",
                        { required: true },
                        "No Bedroom is required"
                      )}
                      invalid={errors.noBedroom && true}
                      {...field}
                    />
                  )}
                />
                {errors.noBedroom && (
                  <FormFeedback>{errors.noBedroom.message}</FormFeedback>
                )}
              </Col>
              <Col xs={3} className="mb-2">
                <Label className="form-label" for="noKitchen">
                  No of Kitchen
                </Label>
                <Controller
                  name="noKitchen"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="noKitchen"
                      type="number"
                      placeholder="How many Kitchen Contains"
                      {...register(
                        "noKitchen",
                        { required: true },
                        "No Kitchen is required"
                      )}
                      invalid={errors.noKitchen && true}
                      {...field}
                    />
                  )}
                />
                {errors.noKitchen && (
                  <FormFeedback>{errors.noKitchen.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="agent">
                  Agent
                </Label>
                <Controller
                  name="agent"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="name"
                      type="select"
                      placeholder="Enter Agent"
                      {...register(
                        "agent",
                        { required: true },
                        "Agent is required"
                      )}
                      invalid={errors.agent && true}
                      {...field}
                    >
                      {Agents?.length && <option>--Select Agenet--</option>}
                      {Agents?.map((agent) => (
                        <option value={agent._id}>{agent.name}</option>
                      ))}
                    </Input>
                  )}
                />
                {errors.agent && (
                  <FormFeedback>{errors.agent.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="additionalInfo">
                  Additional Info
                </Label>
                <Controller
                  name="additionalInfo"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="additionalInfo"
                      placeholder="Further Info"
                      {...register(
                        "additionalInfo",
                        { required: true },
                        "More info is required for porperties"
                      )}
                      invalid={errors.additionalInfo && true}
                      {...field}
                    />
                  )}
                />
                {errors.additionalInfo && (
                  <FormFeedback>{errors.additionalInfo.message}</FormFeedback>
                )}
              </Col>
              <Col xs={4} className="mb-2">
                <Label className="form-label" for="featured">
                  Is Featured
                </Label>
                <Controller
                  name="featured"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="featured"
                      type="select"
                      placeholder="Is Featured Property"
                      {...register(
                        "featured",
                        { required: true },
                        "This Field is required"
                      )}
                      invalid={errors.featured && true}
                      {...field}
                    >
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </Input>
                  )}
                />
                {errors.featured && (
                  <FormFeedback>{errors.featured.message}</FormFeedback>
                )}
              </Col>
              <Col sm={12} md={6}>
                <Label className="form-label">Thumbnail Image</Label>
                <SingleFileUpload
                  title={"Thumbnail Image"}
                  files={image}
                  setFiles={setImage}
                />
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

export default PropertiesModal;
