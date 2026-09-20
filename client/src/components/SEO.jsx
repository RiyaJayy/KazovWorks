import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, image }) {
  const fullTitle = title ? `${title} | KAZOV WORKS` : "KAZOV WORKS — Premium Used Automotive Parts";
  const desc = description || "KAZOV WORKS supplies quality used engine and body parts for old and new vehicles. Browse the catalogue and contact us directly.";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
