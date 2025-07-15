import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const usePageTransition = () => {
  const router = useRouter();

  // Handle start and end of page transitions
  useEffect(() => {
    const handleStart = () => {
      // Add transition class when navigation starts
      document.body.classList.add('page-transition');
    };

    const handleComplete = () => {
      // Remove transition class when navigation completes
      document.body.classList.remove('page-transition');
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Function to handle optimized navigation
  const handleNavigation = (href: string) => (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    // Add transition class to body
    document.body.classList.add('page-transition');
    
    // Optimized navigation - small timeout helps with smoother transitions
    setTimeout(() => {
      router.push(href);
    }, 10);
  };

  // Prefetch multiple routes for faster subsequent navigation
  const prefetchRoutes = (routes: string[]) => {
    routes.forEach(route => {
      router.prefetch(route);
    });
  };

  return { handleNavigation, prefetchRoutes };
};

export default usePageTransition; 