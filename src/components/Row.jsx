import React, { forwardRef } from "react";

export const Row = forwardRef(({ id, ...props }, ref) => {
  return (
    <div {...props} ref={ref}>
      {props.children}
    </div>
  );
});
