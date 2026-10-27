function Note({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;       // html comes from /api/notes (user-authored)
}

function Contact({ website }: { website: string }) {               // `website` is user-supplied profile data
  return <a href={website} target="_blank">Visit website</a>;
}

export async function login(user: string, pass: string) {
  const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ user, pass }) });
  const { token } = await res.json();
  localStorage.setItem('token', token);
}

export async function transfer(to: string, amount: number) {
  return fetch('/api/transfer', {                                    // server also accepts cookie sessions
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({ to, amount }),                            // no content-type header set
  });
}
