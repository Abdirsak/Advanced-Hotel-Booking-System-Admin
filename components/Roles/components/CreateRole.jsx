"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Collapse,
  Alert,
} from "reactstrap";
import { ChevronDown, ChevronRight } from "react-feather";
import toast from "react-hot-toast";
import useCreate from "hooks/useCreate";
import { RolesApi } from "common/utils/axios/api";
import request from "../../../common/utils/axios";
import useUpdate from "hooks/useUpdate";

const menus = [
  {
    name: "Customers",
    description: "Manage customer data",
    permissions: ["Create", "Read", "Update", "Delete"],
  },
  {
    name: "Staffs",
    description: "Manage staff information",
    permissions: ["View", "Edit", "Remove"],
  },
  {
    name: "Orders",
    description: "Handle order processing",
    permissions: ["Process", "Cancel", "Ship", "Return"],
  },
  {
    name: "Products",
    description: "Manage product listings",
    permissions: ["Add", "Edit", "Delete", "View"],
  },
  {
    name: "Reports",
    description: "Access various reports",
    permissions: ["Generate", "Download", "Share"],
  },
  {
    name: "Invoices",
    description: "Manage invoices and billing",
    permissions: ["Create", "Send", "Pay", "View"],
  },
  {
    name: "Inventory",
    description: "Manage inventory levels",
    permissions: ["Add", "Update", "Delete", "View"],
  },
  {
    name: "Suppliers",
    description: "Manage supplier information",
    permissions: ["Add", "Edit", "Delete", "View"],
  },
  {
    name: "Shipping",
    description: "Manage shipping details",
    permissions: ["Schedule", "Track", "Cancel"],
  },
  {
    name: "Returns",
    description: "Handle product returns",
    permissions: ["Initiate", "Process", "Complete"],
  },
  {
    name: "Marketing",
    description: "Manage marketing campaigns",
    permissions: ["Create", "Edit", "Launch", "Analyze"],
  },
  {
    name: "Promotions",
    description: "Manage promotional offers",
    permissions: ["Create", "Edit", "Delete", "View"],
  },
  {
    name: "Users",
    description: "Manage user accounts",
    permissions: ["Add", "Edit", "Delete", "View"],
  },
  {
    name: "Roles",
    description: "Manage roles and permissions",
    permissions: ["Create", "Edit", "Assign", "Delete"],
  },
  {
    name: "Settings",
    description: "Manage application settings",
    permissions: ["Update", "Reset", "View"],
  },
  {
    name: "Notifications",
    description: "Manage system notifications",
    permissions: ["Create", "Send", "Delete", "View"],
  },
  {
    name: "Support",
    description: "Manage customer support tickets",
    permissions: ["Create", "Resolve", "Close", "View"],
  },
  {
    name: "Analytics",
    description: "View and analyze data",
    permissions: ["View", "Export", "Share"],
  },
  {
    name: "Audit Logs",
    description: "View system audit logs",
    permissions: ["View", "Export", "Delete"],
  },
  {
    name: "API Access",
    description: "Manage API access keys",
    permissions: ["Create", "Revoke", "View"],
  },
];

const CreateRole = () => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [selectAllStates, setSelectAllStates] = useState({});
  const [generalSelectAll, setGeneralSelectAll] = useState(false);
  const [collapseStates, setCollapseStates] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleId = searchParams.get("id");

  useEffect(() => {
    if (roleId) {
      request({
        url: `/roles/${roleId}`,
        method: "GET",
      })
        .then((response) => {
          const role = response?.data?.data;
          setRoleName(role.name);
          setRoleDescription(role.description);
          const permissions = {};

          // Check for "Manage" across all or specific menus
          const hasManageAll = role.abilities.some(
            (ability) =>
              ability.subject === "all" && ability.action.includes("Manage")
          );

          if (hasManageAll) {
            // If "Manage all" is set, select all permissions for all menus
            menus.forEach((menu) => {
              permissions[menu.name] = [...menu.permissions];
            });
            setGeneralSelectAll(true);
          } else {
            role.abilities.forEach((ability) => {
              if (ability.action.includes("Manage")) {
                // If "Manage" is set for a specific menu, select all permissions for that menu
                permissions[ability.subject] = [
                  ...menus.find((menu) => menu.name === ability.subject)
                    .permissions,
                ];
              } else {
                // Otherwise, only select specific actions
                permissions[ability.subject] = ability.action;
              }
            });
            setGeneralSelectAll(false);
          }

          setSelectedPermissions(permissions);
        })
        .catch((error) => {
          setErrorMessage("Failed to load role data for editing.");
        });
    }
  }, [roleId]);

  useEffect(() => {
    const newSelectAllStates = {};
    menus.forEach((menu) => {
      const allSelected = menu.permissions.every((permission) =>
        selectedPermissions[menu.name]?.includes(permission)
      );
      newSelectAllStates[menu.name] = allSelected;
    });
    setSelectAllStates(newSelectAllStates);

    const allPermissionsSelected = menus.every((menu) =>
      menu.permissions.every((permission) =>
        selectedPermissions[menu.name]?.includes(permission)
      )
    );
    setGeneralSelectAll(allPermissionsSelected);
  }, [selectedPermissions]);

  const handlePermissionChange = (menuName, permission) => {
    setSelectedPermissions((prevPermissions) => ({
      ...prevPermissions,
      [menuName]: prevPermissions[menuName]?.includes(permission)
        ? prevPermissions[menuName].filter((p) => p !== permission)
        : [...(prevPermissions[menuName] || []), permission],
    }));
  };

  const onDiscard = () => {
    router.replace("/dashboard/roles");
  };

  const { mutate, isPending: isLoading } = useCreate(
    RolesApi,
    "Role Created Successfully",
    () => {
      onDiscard();
    }
  );
  const { mutate: mutateUpdate, isPending: updateLoading } = useUpdate(
    RolesApi,
    "Role Updated Successfully",
    () => {
      onDiscard();
    }
  );

  const handleSelectAllChange = (menuName, permissions, isChecked) => {
    setSelectedPermissions((prevPermissions) => ({
      ...prevPermissions,
      [menuName]: isChecked ? permissions : [],
    }));
  };

  const handleGeneralSelectAllChange = (isChecked) => {
    const updatedPermissions = {};
    menus.forEach((menu) => {
      updatedPermissions[menu.name] = isChecked ? [...menu.permissions] : [];
    });
    setSelectedPermissions(updatedPermissions);
    setGeneralSelectAll(isChecked);
  };

  const toggleCollapse = (menuName) => {
    setCollapseStates((prevStates) => ({
      ...prevStates,
      [menuName]: !prevStates[menuName],
    }));
  };

  const handleSubmit = () => {
    if (!roleName.trim()) {
      setErrorMessage("Role name is required.");
      return;
    }
    if (!roleDescription.trim()) {
      setErrorMessage("Role description is required.");
      return;
    }

    const anyPermissionSelected = Object.values(selectedPermissions).some(
      (permissions) => permissions.length > 0
    );

    if (!anyPermissionSelected) {
      setErrorMessage("At least one permission must be selected.");
      return;
    }

    setErrorMessage("");

    let abilities;

    if (generalSelectAll) {
      abilities = [{ subject: "all", action: ["Manage"] }];
    } else {
      abilities = menus
        .map((menu) => {
          if (
            selectedPermissions[menu.name]?.length === menu.permissions.length
          ) {
            return { subject: menu.name, action: ["Manage"] };
          }
          return {
            subject: menu.name,
            action: selectedPermissions[menu.name] || [],
          };
        })
        .filter((ability) => ability.action.length > 0);
    }

    if (roleId) {
      console.log("Role: ", roleId);
      mutateUpdate({
        updateId: roleId,
        data: { name: roleName, description: roleDescription, abilities },
      });
    } else {
      mutate({ name: roleName, description: roleDescription, abilities });
    }

    toast.success(
      roleId ? "Role Updated Successfully!" : "Role Created Successfully!"
    );
  };

  return (
    <Card>
      <CardHeader>
        <h1>{roleId ? "Edit Role" : "Create New Role"}</h1>
      </CardHeader>
      <CardBody>
        <Form>
          {errorMessage && <Alert color="danger">{errorMessage}</Alert>}
          <FormGroup>
            <Label for="roleName">Role Name</Label>
            <Input
              type="text"
              id="roleName"
              placeholder="Enter role name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label for="roleDescription">Role Description</Label>
            <Input
              type="textarea"
              id="roleDescription"
              placeholder="Enter role description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              style={{ height: "100px" }}
            />
          </FormGroup>
          <FormGroup>
            <Table borderless>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>
                    <FormGroup
                      check
                      style={{ marginBottom: "0", marginLeft: "10px" }}
                    >
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={generalSelectAll}
                          onChange={(e) =>
                            handleGeneralSelectAllChange(e.target.checked)
                          }
                        />
                        Select All Permissions
                      </Label>
                    </FormGroup>
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu, index) => (
                  <tr
                    key={index}
                    style={{
                      borderTop: "1px solid #ddd",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    <td>
                      <strong>{menu.name}</strong>
                    </td>
                    <td>{menu.description}</td>
                    <td>
                      <FormGroup check style={{ marginBottom: "10px" }}>
                        <Label check>
                          <Input
                            type="checkbox"
                            checked={selectAllStates[menu.name] || false}
                            onChange={(e) =>
                              handleSelectAllChange(
                                menu.name,
                                menu.permissions,
                                e.target.checked
                              )
                            }
                          />
                          Select All
                        </Label>
                      </FormGroup>
                      <Collapse isOpen={collapseStates[menu.name]}>
                        <div style={{ paddingTop: "10px" }}>
                          {menu.permissions.map((permission, idx) => (
                            <div key={idx} style={{ marginBottom: "10px" }}>
                              <FormGroup check>
                                <Label check>
                                  <Input
                                    type="checkbox"
                                    value={permission}
                                    checked={selectedPermissions[
                                      menu.name
                                    ]?.includes(permission)}
                                    onChange={() =>
                                      handlePermissionChange(
                                        menu.name,
                                        permission
                                      )
                                    }
                                  />
                                  {permission}
                                </Label>
                              </FormGroup>
                            </div>
                          ))}
                        </div>
                      </Collapse>
                    </td>
                    <td>
                      <Button
                        color="link"
                        onClick={() => toggleCollapse(menu.name)}
                      >
                        {collapseStates[menu.name] ? (
                          <ChevronDown />
                        ) : (
                          <ChevronRight />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </FormGroup>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              color="primary"
              onClick={handleSubmit}
              style={{ marginTop: "20px" }}
              disabled={isLoading} // Disable button while loading
            >
              {roleId ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default CreateRole;
