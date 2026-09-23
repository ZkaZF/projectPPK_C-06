import logoUndip from "../../assets/dipo.png";

type UniversityLogoProps = {
  className?: string;
};

export const UniversityLogo = ({ className = "" }: UniversityLogoProps) => (
  <span className={`university-logo ${className}`.trim()} aria-label="Logo Universitas Diponegoro">
    <img
      src={logoUndip}
      alt="Logo Universitas Diponegoro"
      className="university-logo-img"
    />
    <span className="university-logo-label">UNDIP</span>
  </span>
);