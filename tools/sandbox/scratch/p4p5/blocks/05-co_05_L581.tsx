type DialogProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  showCloseButton?: boolean;
  footerPrimaryLabel?: string;
  onFooterPrimary?: () => void;
  footerSecondaryLabel?: string;
  onFooterSecondary?: () => void;
  footerPrimaryDisabled?: boolean;
  headerIcon?: ReactNode;
  children: ReactNode;
};
export {};
