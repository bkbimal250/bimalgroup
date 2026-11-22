import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { ThemeProvider } from '@/src/context/ThemeContext';
import { Header } from '@/src/components/Header';
import { Footer } from '@/src/components/Footer';
import { EnquiryPopup } from '@/src/components/EnquiryPopup';
import { HomePage } from '@/src/pages/HomePage';
import { WorkPage } from '@/src/pages/WorkPage';
import { CaseStudyPage } from '@/src/pages/CaseStudyPage';
import { AboutPage } from '@/src/pages/AboutPage';
import { ContactPage } from '@/src/pages/ContactPage';
import { PrivacyPage } from '@/src/pages/PrivacyPage';
import { TermsPage } from '@/src/pages/TermsPage';
import { NotFoundPage } from '@/src/pages/NotFoundPage';
import { navigationConfig } from '@/src/data/navigation';
import { siteConfig } from '@/src/data/site';

const AdminEnquiriesRoute = lazy(
  () => import('@/src/pages/AdminEnquiriesRoute'),
);

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        target.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <BrowserRouter>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--accent-foreground)]"
              >
                Skip to main content
              </a>

              <Header
                brandName={siteConfig.brandName}
                links={navigationConfig.mainNav}
                primaryCta={navigationConfig.primaryCta}
              />

              <main id="main-content" className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/work" element={<WorkPage />} />
                  <Route path="/work/:slug" element={<CaseStudyPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route
                    path="/enquiries"
                    element={
                      <Suspense
                        fallback={
                          <p className="p-8 text-sm text-[var(--muted)]">
                            Loading admin tools...
                          </p>
                        }
                      >
                        <AdminEnquiriesRoute />
                      </Suspense>
                    }
                  />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

            <Footer
              brandName={siteConfig.brandName}
              legalName={siteConfig.legalName}
              description={siteConfig.description}
              locationLabel={siteConfig.locationLabel}
              primaryEmail={siteConfig.primaryEmail}
              primaryPhone={siteConfig.primaryPhone}
              primaryPhoneHref={siteConfig.primaryPhoneHref}
              columns={navigationConfig.footerColumns}
              legalLinks={navigationConfig.legalLinks}
            />
          </div>
          <EnquiryPopup />
        </BrowserRouter>
      </ThemeProvider>
    </MotionConfig>
  );
}
