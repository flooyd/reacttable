import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  useSensor,
  useSensors,
  rectIntersection,
  MeasuringStrategy,
  MeasuringConfiguration,
  getClientRect,
  DragOverlay,
  closestCenter,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
  restrictToFirstScrollableAncestor,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";

import { SortableRow } from "./components/SortableRow";
import { Row } from "./components/Row";

export function Table(props) {
  const [justDropped, setJustDropped] = useState(null);
  const [dropableClass, setDropableClass] = useState("table");
  const [active, setActive] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [items, setItems] = useState([
    { key: 1, id: 1, name: "Bob" },
    { key: 2, id: 2, name: "Sarah" },
    { key: 3, id: 3, name: "Jason" },
    { key: 4, id: 4, name: "Robert" },
    { key: 5, id: 5, name: "Jeff" },
    { key: 6, id: 6, name: "Tom" },
    { key: 7, id: 7, name: "Sue" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 50,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (active) {
      setDropableClass("table dropable");
    }
  }, [active]);

  function handleDragStart(event) {
    setIsSorting(true);
    setActive(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items) => {
        const startIndex = items.findIndex((i) => i.id === active.id);
        const endIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, startIndex, endIndex);
      });
      setJustDropped(active.id);
    }

    setActive(null);
    setTimeout(() => {
      setJustDropped(null);
      setDropableClass("table");
    }, 750);
  }

  function getFirstRowDropableStyle() {
    if (active) {
      return {
        borderBottom: "3px solid blue",
      };
    }
  }

  const customDropAnimation = {
    keyframes({ transform }) {
      return [
        {
          background: "white",
          color: "black",
          transform: CSS.Transform.toString(transform.initial),
        },
        {
          background: "lightblue",
          color: "black",
          transform: CSS.Transform.toString(transform.final),
        },
      ];
    },
  };

  return (
    <>
      <div
        className={dropableClass + " firstRow"}
        style={getFirstRowDropableStyle()}
      >
        <div>Id</div>
        <div>Name</div>
        <div>Description</div>
        <div>Other Field</div>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        modifiers={[restrictToVerticalAxis, restrictToFirstScrollableAncestor]}
      >
        <SortableContext items={items}>
          <div className={dropableClass}>
            {items.map((item) => (
              <SortableRow
                justDropped={justDropped}
                key={item.id}
                id={item.id}
                rowClass="row"
              >
                <div>{item.id}</div>
                <div>{item.id}</div>
                <div>blah blah blah...</div>
                <div>Hello friends here is some text</div>
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </>
  );
}
