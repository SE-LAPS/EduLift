import { useRouter } from 'next/router';

/**
 * Handles navigation to a specified route with image preloading
 * @param route The route to navigate to
 * @param imageUrl Optional image URL to preload before navigation
 * @returns A function that can be called to perform the navigation
 */
export const useImageLoadNavigation = () => {
  const router = useRouter();
  
  const navigateWithImageLoad = (route: string, imageUrl?: string) => {
    if (!imageUrl) {
      router.push(route);
      return;
    }
    
    // Create a loading state that can be used in the UI
    const loadingState = { loading: true, progress: 0 };
    
    // Create a new image element to preload
    const img = new Image();
    
    // Set up load tracking
    img.onload = () => {
      // Image is loaded, navigate to the route
      router.push(route);
    };
    
    img.onerror = () => {
      // If image fails to load, still navigate
      console.error(`Failed to preload image: ${imageUrl}`);
      router.push(route);
    };
    
    // Start loading the image
    img.src = imageUrl;
    
    return loadingState;
  };
  
  return navigateWithImageLoad;
};

/**
 * Preloads an array of images
 * @param imageUrls Array of image URLs to preload
 * @returns A promise that resolves when all images are loaded
 */
export const preloadImages = (imageUrls: string[]): Promise<void[]> => {
  const loadPromises = imageUrls.map(url => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => {
        console.error(`Failed to preload image: ${url}`);
        resolve(); // Resolve anyway to not block other images
      };
      img.src = url;
    });
  });
  
  return Promise.all(loadPromises);
}; 