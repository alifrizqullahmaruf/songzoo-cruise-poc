import type { ReactNode } from "react";
import { PageBody } from "./PageBody";

type Props = {
  title: string;
  route: string;
  children?: ReactNode;
};

export function StubPage({ title, route, children }: Props) {
  return (
    <PageBody className="gap-3">
      <h2 className="text-xl font-bold uppercase">{title}</h2>
      <p className="text-sm text-muted">{route}</p>
      <p className="text-xs text-muted">
        Placeholder &mdash; will be implemented in a later phase.
      </p>
      {children}
    </PageBody>
  );
}
