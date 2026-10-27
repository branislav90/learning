const IconButton = ({ icon, ...rest }: React.ComponentProps<"button"> & { icon: string }) => (
  <Button {...rest}><img src={icon} alt="" /></Button>
);
export {};
