<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Header>
    <BackButton />
    <Dialog.Title>Delete project</Dialog.Title>
  </Dialog.Header>
  <Dialog.Body>This will permanently remove 14 deployments.</Dialog.Body>
  <Dialog.Footer>
    <label><input type="checkbox" /> Don't ask again</label>
    <Dialog.Close>Cancel</Dialog.Close>
    <Button variant="danger" onClick={onDelete}>Delete</Button>
  </Dialog.Footer>
</Dialog>
export {};
