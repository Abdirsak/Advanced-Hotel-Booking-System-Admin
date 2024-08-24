"use client";
import React from "react";

const PermissionCheckbox = ({ permission }) => {
  return (
    <label>
      <input type="checkbox" /> {permission}
    </label>
  );
};

export default PermissionCheckbox;
