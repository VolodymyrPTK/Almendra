import { onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export function useStatePersistence() {
  const route = useRoute();
  const router = useRouter();

  const saveState = () => {
    const state = {
      route: {
        fullPath: route.fullPath,
        params: route.params,
        query: route.query,
      },
      scrollPosition: {
        x: window.scrollX,
        y: window.scrollY,
      }
    };
    sessionStorage.setItem('appState', JSON.stringify(state));
  };

  const restoreState = () => {
    const savedState = sessionStorage.getItem('appState');
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.route && state.route.fullPath !== route.fullPath) {
        router.replace(state.route.fullPath);
      }
      if (state.scrollPosition) {
        window.scrollTo(state.scrollPosition.x, state.scrollPosition.y);
      }
    }
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      saveState();
    }
  };

  const handlePageHide = () => {
    saveState();
  };

  onMounted(() => {
    restoreState();
    // Add multiple event listeners for better iOS support
    window.addEventListener('beforeunload', saveState);
    window.addEventListener('pagehide', handlePageHide);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // iOS-specific events
    window.addEventListener('blur', saveState);
    window.addEventListener('freeze', saveState);
  });

  onBeforeUnmount(() => {
    // Remove all event listeners
    window.removeEventListener('beforeunload', saveState);
    window.removeEventListener('pagehide', handlePageHide);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', saveState);
    window.removeEventListener('freeze', saveState);
  });
}
