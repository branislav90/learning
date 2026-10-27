function CommentList() {
  const { comments, status } = useComments();   // "container" logic as a hook
  return <CommentListView comments={comments} status={status} />;
}
export {};
