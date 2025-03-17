import React from "react";
import { BackButton } from "./BackButton";
import { useElementHeight } from "../hooks/useElementHeight";
import "./PageLayout.css";

type Props = {
  children: React.ReactNode;
  showBackButton?: boolean;
  backTo?: string;
};

export function PageLayout({ 
  children, 
  showBackButton = true, 
  backTo 
}: Props) {
  const { elementRef, height: navHeight } = useElementHeight<HTMLElement>();

  return (
    <>
      <nav ref={elementRef} className="page-navbar">
        {showBackButton && <BackButton to={backTo} />}
      </nav>
      <main className="page-content" style={{ marginTop: navHeight - 16 }}>
        {children}
      </main>
    </>
  );
}
