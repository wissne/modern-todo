// View Transitions API utilities
export const supportsViewTransitions = () => {
  return 'startViewTransition' in document;
};

export const withViewTransition = (updateFunction) => {
  if (!supportsViewTransitions()) {
    // Fallback for browsers that don't support View Transitions API
    updateFunction();
    return;
  }

  // Use View Transitions API
  document.startViewTransition(() => {
    updateFunction();
  });
};

export const withNamedViewTransition = (updateFunction, transitionName) => {
  if (!supportsViewTransitions()) {
    updateFunction();
    return;
  }

  // Add transition name for specific animations
  const transition = document.startViewTransition(() => {
    updateFunction();
  });

  // Optional: Handle transition events
  transition.ready.then(() => {
    console.log(`View transition "${transitionName}" started`);
  });

  transition.finished.then(() => {
    console.log(`View transition "${transitionName}" completed`);
  });

  return transition;
};

// Specific transition helpers
export const transitionViewChange = (updateFunction) => {
  return withNamedViewTransition(updateFunction, 'view-change');
};

export const transitionTodoUpdate = (updateFunction) => {
  return withNamedViewTransition(updateFunction, 'todo-update');
};

export const transitionNavigation = (updateFunction) => {
  return withNamedViewTransition(updateFunction, 'navigation');
};