import React from "react";
import { useNavigate } from "react-router";

type Props = {
  to?: string;
};

export function BackButton({ to }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: "4px 12px",
        backgroundColor: "transparent",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "4px",
        fontSize: "14px",
        color: "#333"
      }}
    >
      <span style={{ fontSize: "18px" }}>←</span>
      <span>Volver</span>
    </button>
  );
}
