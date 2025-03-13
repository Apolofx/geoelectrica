import React from "react";
import { Link } from "react-router";
type Props = {
  to: string;
  children?: React.ReactNode;
};
export function LinkButton({ to, children }: Props) {
  return (
    <Link to={to}>
      <div style={{ margin: "auto", textAlign: "center" }}>
        <button style={{ width: "100%" }}>{children}</button>
      </div>
    </Link>
  );
}
