import Head from "next/head";
import React from "react";

export type SeoProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export function SEO(props: SeoProps) {
  const { title, description, children } = props;
  return (
    <Head>
      <title>{`Linkify${title ? ` / ${title}` : ""}`}</title>
      {description && <meta name="description" content={description} />}
      {children}
    </Head>
  );
}
