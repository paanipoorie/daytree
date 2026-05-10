function BrandLogo({ size = "small" }) {
  return (
    <span className={`brand-logo brand-logo-${size}`} aria-hidden="true">
      <span className="brand-logo-trunk" />
      <span className="brand-logo-branch brand-logo-branch-left" />
      <span className="brand-logo-branch brand-logo-branch-right" />
      <span className="brand-logo-leaf brand-logo-leaf-top" />
      <span className="brand-logo-leaf brand-logo-leaf-left" />
      <span className="brand-logo-leaf brand-logo-leaf-right" />
    </span>
  );
}

export default BrandLogo;
