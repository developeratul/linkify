import Head from "next/head";

export type SeoProps = {
  title?: string;
  description?: string;
};

export function SEO(props: SeoProps) {
  const { title, description } = props;
  return (
    <Head>
      <title>{`LinkVault${title ? ` / ${title}` : ""}`}</title>
      {description && <meta name="description" content={description} />}
    </Head>
  );
}
