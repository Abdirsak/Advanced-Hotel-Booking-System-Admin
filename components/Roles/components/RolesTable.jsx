"use client";
import React from 'react';
import RolesRow from './RolesRow';

const RolesTable = ({ menus }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Menu</th>
          <th>Description</th>
          <th>Permissions</th>
        </tr>
      </thead>
      <tbody>
        {menus.map((menu, index) => (
          <RolesRow key={index} menu={menu} />
        ))}
      </tbody>
    </table>
  );
};

export default RolesTable;
