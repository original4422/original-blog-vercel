import { pageContent } from '@original/content';
import Link from 'next/link';
import '@/components/listing.css';

export default function NotFound() {
  return (
    <main id="main-content" className="not-found">
      <strong>{pageContent.notFound.title}</strong>
      <h1>{pageContent.notFound.message}</h1>
      <Link href="/">{pageContent.notFound.backHome}</Link>
    </main>
  );
}
