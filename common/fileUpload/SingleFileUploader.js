// ** React Imports
import { useState, Fragment } from "react";

// ** Reactstrap Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";

const FileUploaderSingle = ({ files, setFiles }) => {
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      setFiles([...acceptedFiles.map((file) => Object.assign(file))]);
    },
  });
  // const { getRootProps, getInputProps } = useDropzone({
  //   multiple: false,
  //   onDrop: acceptedFiles => {
  //     setFiles([...acceptedFiles.map(file => Object.assign(file))])
  //   }
  // })

  const renderFilePreview = (file) => {
    if (file.type.startsWith("image")) {
      return (
        <img
          className="rounded"
          alt={file.name}
          src={URL.createObjectURL(file)}
          height="28"
          width="28"
        />
      );
    } else {
      return <FileText size="28" />;
    }
  };

  const renderUploadedImage = () => {
    if (files.length && typeof files[0] !== "string") {
      // @ts-ignore
      return files.map((file) => (
        <img
          key={file.name}
          alt={file.name}
          className="single-file-image img-fluid h-100 w-100 position-absolute object-cover"
          src={URL.createObjectURL(file)}
        />
      ));
    } else {
      if (typeof files[0] === "string") {
        return (
          <img
            alt="task-img"
            className="single-file-image img-fluid h-100 w-100 position-absolute object-cover"
            src={files[0]}
          />
        );
      }
    }
  };

  const handleRemoveFile = (file) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const renderFileSize = (size) => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
    }
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  return (
    <div>
      <div {...getRootProps({ className: "dropzone position-relative" })}>
        <input {...getInputProps()} />
        <div className="d-flex align-items-center justify-content-center flex-column text-center">
          <DownloadCloud size={64} />
          <h5>Drop Files here or click to upload</h5>
        </div>
        {files.length ? renderUploadedImage() : null}
      </div>
    </div>
  );
};

export default FileUploaderSingle;
