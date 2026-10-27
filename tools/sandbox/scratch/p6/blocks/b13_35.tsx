if (status === 'loading') return <Spinner />;
if (status === 'error') return <ErrorView />;
return <Profile data={data} />;
export {};
