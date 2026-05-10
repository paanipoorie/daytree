import BrandLogo from "./BrandLogo";

function BrandMark({ size = "small" }) {
  return (
    <span className={`brand-mark brand-mark-${size}`}>
      <BrandLogo size={size} />
      <span>DayTree</span>
    </span>
  );
}

export default BrandMark;
