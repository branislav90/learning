interface CardProps {
  title: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  showFooter?: boolean;
  footerText?: string;
  footerAction?: () => void;
  footerActionLabel?: string;
  isHighlighted?: boolean;
  isCompact?: boolean;
  headerIcon?: ReactNode;
  renderBody?: () => ReactNode;
}
export {};
