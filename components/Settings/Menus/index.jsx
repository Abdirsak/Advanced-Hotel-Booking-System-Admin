"use client";

import React, { useState } from "react";
import { Container } from "reactstrap";
import MenuItem from "./MenuItem";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Menu = () => {
  const [items, setItems] = useState([
    { label: "Home" },
    { label: "Who We Are" },
    { label: "Program" },
  ]);

  const moveItem = (fromIndex, toIndex) => {
    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(fromIndex, 1);
    updatedItems.splice(toIndex, 0, movedItem);
    setItems(updatedItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Container>
        {items.map((item, index) => (
          <MenuItem key={index} index={index} item={item} moveItem={moveItem} />
        ))}
      </Container>
    </DndProvider>
  );
};

export default Menu;
