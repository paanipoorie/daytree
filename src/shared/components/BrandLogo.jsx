function BrandLogo({ size = "small" }) {
  return (
    <span className={`brand-logo brand-logo-${size}`} aria-hidden="true">
      <img src="/favicon.svg" alt="" />
    </span>
  );
}

export default BrandLogo;
