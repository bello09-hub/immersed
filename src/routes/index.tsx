import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'IMMERSED — Your character. Your life. Your story.' },
    { name: 'description', content: 'Create your character and live your story in IMMERSED, with evolving portraits, meaningful relationships, school life and four saved lives.' },
    { property: 'og:title', content: 'IMMERSED — Your character. Your life. Your story.' },
    { property: 'og:description', content: 'A text-based life simulation with customizable characters, lifelong aging and meaningful choices.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Index() {
  return <iframe title="IMMERSED life simulation" src="/game/index.html" className="immersed-game-frame" />;
}