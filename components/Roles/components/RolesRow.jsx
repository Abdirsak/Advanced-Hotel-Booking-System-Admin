"use client";
import React from "react";
import PermissionCheckbox from "./PermissionCheckbox";

const RolesRow = ({ menu }) => {
  return (
    <tr>
      <td>{menu.name}</td>
      <td>{menu.description}</td>
      <td>
        {menu.permissions.map((permission, index) => (
          <PermissionCheckbox key={index} permission={permission} />
        ))}
      </td>
    </tr>
  );
};

export default RolesRow;
