export const withDocumentTitle = (title: string) =>
  <P extends object>(Component: ComponentType<P>) => {
    function WithDocumentTitle(props: P) {
      useDocumentTitle(title);
      return <Component {...props} />;
    }
    WithDocumentTitle.displayName = `WithDocumentTitle(${Component.displayName ?? Component.name})`;
    return WithDocumentTitle;
  };

export function useDocumentTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => { document.title = previous; };
  }, [title]);
}
export {};
