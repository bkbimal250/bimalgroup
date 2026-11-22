import { Link } from 'react-router-dom';
import { SEOHead } from '@/src/components/SEOHead';
import { EmptyState } from '@/src/components/EmptyState';
import { Button } from '@/src/components/ui/button';
import { seoConfig } from '@/src/data/seo';

export function NotFoundPage() {
  return (
    <>
      <SEOHead
        title={`Page Not Found — ${seoConfig.siteName}`}
        description="The requested page could not be found."
        path="/404"
      />
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <EmptyState
          title="Page not found"
          description="The URL you visited does not correspond to an active page on Bimal Global."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link to="/">Go to Home</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/work">Explore Work</Link>
              </Button>
            </div>
          }
        />
      </div>
    </>
  );
}
