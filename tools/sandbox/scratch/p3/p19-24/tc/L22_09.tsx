import { useState, useTransition } from 'react';

type Tab = 'about' | 'posts' | 'contact';

export function Tabs() {
  const [tab, setTab] = useState<Tab>('about');
  const [isPending, startTransition] = useTransition();

  function select(next: Tab) {
    startTransition(() => {
      setTab(next); // non-urgent: rendering <Posts/> is slow
    });
  }

  return (
    <>
      <nav>
        {(['about', 'posts', 'contact'] as const).map((t) => (
          <button key={t} onClick={() => select(t)} aria-current={tab === t}>
            {t}
          </button>
        ))}
      </nav>
      <main style={{ opacity: isPending ? 0.6 : 1 }}>
        {tab === 'about' && <About />}
        {tab === 'posts' && <SlowPosts />}
        {tab === 'contact' && <Contact />}
      </main>
    </>
  );
}
