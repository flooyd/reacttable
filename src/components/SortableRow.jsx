import React, { useEffect, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Row } from "./Row";

export function SortableRow(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    transform,
    transition,
    isOver,
    node,
  } = useSortable({
    id: props.id,
    transition: {
      duration: 250,
      easing: "cubic-bezier(1, 1, 0.5, 1)",
    },
  });

  const [rowClass, setRowClass] = useState("row");

  useEffect(() => {
    if (props.justDropped === props.id) {
      setRowClass("row rowDropped");
    } else if (props.justDropped === null) {
      setRowClass("row");
    }
  }, [props.justDropped, props.rowClass]);

  function getDefaultStyle() {
    return transform
      ? {
          position: "relative",
          transition,
          transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          background: isDragging ? "lightgreen" : "white",
          zIndex: isDragging ? 99999 : 1,
          boxShadow: isDragging ? "5px 5px 5px 0px rgba(0,0,0,0.25)" : "none",
        }
      : undefined;
  }

  return (
    <Row
      className={rowClass}
      ref={setNodeRef}
      style={getDefaultStyle()}
      {...attributes}
      {...listeners}
    >
      {props.children}
    </Row>
  );
}
