import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../components/styles/swiper.css';

export interface Props {
  onLeftSwipe?: Function; // Callback when the left swipe is completed
  onLeftSwipeConfirm?: Function; // Callback on left swipe confirmation
  leftSwipeComponent?: React.ReactNode; // Used to set the left swipe component (button, icon)
  onRightSwipe?: Function; // Callback when the right swipe is completed
  onRightSwipeConfirm?: Function; // Callback on right swipe confirmation
  rightSwipeComponent?: React.ReactNode; // Used to set the right swipe component (button, icon)
  disabled?: boolean; // Disables both right and left swipes
  height?: number; // Allows setting the height for the entire swipe component, should match the child's height
  transitionDuration?: number; // Sets animation duration
  swipeWidth?: number; // Sets the visible width of the swipe component under the child (content)
  swipeThreshold?: number; // Sets the threshold for swipe (as a percentage of the child's width)
  showSwipeAction?: boolean; // If false, only full swipe is available
  leftSwipeColor?: string; // Sets the left swipe background color
  leftSwipeText?: string; // Sets the left swipe text
  rightSwipeColor?: string; // Sets the right swipe background color
  rightSwipeText?: string; // Sets the right swipe text
  className?: string;
  id?: string;
  disableLeftSwipe?: boolean; // Disables the left swipe
  disableRightSwipe?: boolean; // Disables the right swipe
  destructiveLeftSwipe?: boolean; // Applies destructive animation (disappear with animation) for the left swipe
  destructiveRightSwipe?: boolean; // Applies destructive animation (disappear with animation) for the right swipe
  onSwipeStateCompleted?: Function; // Callback that notifies that the swipe is completed (can be used to disable/enable user interaction with child content if needed)
  children?: React.ReactNode; // Content of the swipe component
}

// Function to get the horizontal position of the cursor or touch during an event
const cursorPosition = (event: any) => {
  // Check if the event is a touch event and has a valid clientX property
  // Return the horizontal position of the first touch
  if (event?.touches?.[0]?.clientX) {
    return event.touches[0].clientX;
  }

  // Check if the event is a mouse event and has a valid clientX property
  // Return the horizontal position of the mouse cursor
  if (event?.clientX) {
    return event?.clientX;
  }

  // Check if the event is a touch event (nativeEvent) and has a valid clientX property
  // Return the horizontal position of the first touch in nativeEvent
  if (event?.nativeEvent?.touches?.[0]?.clientX) {
    return event.nativeEvent.touches[0].clientX;
  }

  // If none of the above conditions are met, return the horizontal position from nativeEvent
  return event?.nativeEvent?.clientX;
};

const Swipe = ({
  onLeftSwipe,
  onLeftSwipeConfirm,
  leftSwipeComponent,
  onRightSwipe,
  onRightSwipeConfirm,
  rightSwipeComponent,
  disabled = false,
  height = 50,
  transitionDuration = 250,
  swipeWidth = 75,
  swipeThreshold = 50,
  showSwipeAction = true,
  leftSwipeColor = 'rgba(252, 255, 148, 1.00)',
  leftSwipeText = 'Edit',
  rightSwipeColor = 'rgba(252, 254, 250, 1.00)',
  rightSwipeText = 'Delete',
  className = '',
  id = '',
  disableLeftSwipe = false,
  disableRightSwipe = false,
  destructiveLeftSwipe = false,
  destructiveRightSwipe = false,
  onSwipeStateCompleted,
  children,
}: Props) => {
  const [touching, setTouching] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [leftSwiping, setLeftSwiping] = useState(false);
  const [rightSwiping, setRightSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState('');
  const [transitioning, setTransitioning] = useState(false);

  const startTouchPosition = useRef(0);
  const initTranslate = useRef(0);
  const container = useRef<HTMLDivElement>(null);
  const containerWidth: number =
    container.current?.getBoundingClientRect().width || 0;
  const swipeWithoutConfirmThreshold: number =
    containerWidth * (swipeThreshold / 100);

  const onStart = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      // If swiping is disabled, do nothing
      if (disabled) return;

      // If already in a touch interaction, do nothing
      if (touching) return;

      // Record the initial touch position and translation
      startTouchPosition.current = cursorPosition(event);
      initTranslate.current = translate;

      // Set touching to true to indicate the start of a touch interaction
      setTouching(true);
    },
    [disabled, touching, translate]
  );

  // useEffect to notify about swipe state completion
  useEffect(() => {
    // Check if onSwipeStateCompleted callback is provided
    if (onSwipeStateCompleted) {
      // Call the callback with a boolean indicating whether the swipe is completed (translate === 0)
      onSwipeStateCompleted(translate === 0);
    }
  }, [translate]);

  // useEffect to set styles for swipe component
  useEffect(() => {
    // Get the container element
    const root = container.current;

    // Set styles using CSS variables for swipe component height
    root?.style.setProperty('--swiperHeight', height + 'px');

    // Set styles using CSS variables for swipe component transition duration
    root?.style.setProperty(
      '--swiperTransitionDuration',
      transitionDuration + 'ms'
    );

    // Set styles using CSS variables for left swipe background color
    root?.style.setProperty('--swiperLeftColor', leftSwipeColor);

    // Set styles using CSS variables for right swipe background color
    root?.style.setProperty('--swiperRightColor', rightSwipeColor);

    // Set styles using CSS variables for visible width of the swipe component under the child
    root?.style.setProperty('--swiperSwipeWidth', swipeWidth + 'px');
  }, [leftSwipeColor, rightSwipeColor, swipeWidth, height, transitionDuration]);

  // useEffect to manage visibility based on swipe configuration
  useEffect(() => {
    // Get the container element
    const root = container.current;

    // Sets fixed visibility in case when right swipe is disabled
    if (disableRightSwipe) {
      root?.style.setProperty('--visibilityLeft', 'visible');
      root?.style.setProperty('--visibilityRight', 'hidden');
      // Sets fixed visibility in case when left swipe is disabled
    } else if (disableLeftSwipe) {
      root?.style.setProperty('--visibilityLeft', 'hidden');
      root?.style.setProperty('--visibilityRight', 'visible');
      // Sets dynamic visibility in case when both swipes are enabled
    } else {
      root?.style.setProperty(
        '--visibilityLeft',
        swipeDirection === 'left' ? 'visible' : 'hidden'
      );
      root?.style.setProperty(
        '--visibilityRight',
        swipeDirection === 'right' ? 'visible' : 'hidden'
      );
    }
  }, [swipeDirection]);

  // useEffect to update the translate property in the swipe container
  useEffect(() => {
    // Get the container element
    const root = container.current;

    // Set the translate property based on the current state
    root?.style.setProperty('--swiperTranslate', translate + 'px');
  }, [translate, swipeWidth, containerWidth, swipeWithoutConfirmThreshold]);

  // Callback function for handling touch or mouse movement during a swipe
  const onMove = useCallback(
    function (event: TouchEvent | MouseEvent) {
      // Return early if not currently in a touching state
      if (!touching) return;

      // Calculate the current position based on the event
      const currentPosition = cursorPosition(event);

      // Calculate the distance moved from the starting position
      const moveDistance = currentPosition - startTouchPosition.current;

      // Determine the swipe direction based on the move distance
      setSwipeDirection(moveDistance >= 0 ? 'right' : 'left');

      // Initialize a variable to store the new translate value
      let newTranslate = moveDistance;

      // Check if right swipe is disabled
      if (disableRightSwipe) {
        // Restrict the newTranslate value to be at most 0 (no right swipe allowed)
        newTranslate = Math.min(0, translate + moveDistance);

        // Return early if attempting a right swipe when disabled
        if (translate >= 0 && moveDistance >= 0) {
          return;
        }
      } else if (disableLeftSwipe) {
        // Restrict the newTranslate value to be at least 0 (no left swipe allowed)
        newTranslate = Math.max(0, translate + moveDistance);

        // Return early if attempting a left swipe when disabled
        if (translate <= 0 && moveDistance <= 0) {
          return;
        }
      }

      // Update the translate state with the new calculated value
      setTranslate(newTranslate);
    },
    [touching]
  );

  // Callback function for handling mouse movement during a swipe
  const onMouseMove = useCallback(
    function (event: MouseEvent): any {
      // Delegate to the common onMove function
      onMove(event);
    },
    [onMove]
  );

  // Callback function for handling touch movement during a swipe
  const onTouchMove = useCallback(
    function (event: TouchEvent): any {
      // Delegate to the common onMove function
      onMove(event);
    },
    [onMove]
  );

  // Callback function triggered when left swipe is confirmed
  const onLeftSwipeConfirmed = useCallback(() => {
    // Perform actions on left swipe confirmation
    onSwipeCancel();
    setLeftSwiping(() => true);

    // If a callback for left swipe exists, delay its execution based on transition duration
    if (onLeftSwipe) window.setTimeout(onLeftSwipe, transitionDuration);
  }, [onLeftSwipe, transitionDuration]);

  // Callback function triggered when right swipe is confirmed
  const onRightSwipeConfirmed = useCallback(() => {
    // Perform actions on right swipe confirmation
    onSwipeCancel();
    setRightSwiping(() => true);

    // If a callback for right swipe exists, delay its execution based on transition duration
    if (onRightSwipe) window.setTimeout(onRightSwipe, transitionDuration);
  }, [onRightSwipe, transitionDuration]);

  // Callback function triggered when swipe is canceled
  const onSwipeCancel = useCallback(() => {
    // Reset various state variables and positions
    setTouching(() => false);
    setTranslate(() => 0);
    setLeftSwiping(() => false);
    setRightSwiping(() => false);
    startTouchPosition.current = 0;
    initTranslate.current = 0;
  }, [onLeftSwipe, onRightSwipe, transitionDuration]);

  // Callback function triggered when left swipe is clicked
  const onLeftSwipeClick = useCallback(() => {
    // Return early if left swipe is disabled or overall component is disabled
    if (disableLeftSwipe || disabled) return;

    // Set transitioning to true before the action
    setTransitioning(true);

    // Check if a left swipe confirmation callback exists
    if (onLeftSwipeConfirm) {
      // Execute the left swipe confirmation callback
      onLeftSwipeConfirm(() => {
        // Set transitioning to false after the action is done
        setTransitioning(false);
        // Trigger actions on left swipe confirmed
        onLeftSwipeConfirmed();
      }, onSwipeCancel);
    } else {
      // Set transitioning to false after the action is done
      setTransitioning(false);
      // Trigger actions on left swipe confirmed
      onLeftSwipeConfirmed();
    }
  }, [
    onLeftSwipeConfirm,
    onLeftSwipeConfirmed,
    onSwipeCancel,
    disableLeftSwipe,
  ]);

  // Callback function triggered when right swipe is clicked
  const onRightSwipeClick = useCallback(() => {
    // Return early if right swipe is disabled or overall component is disabled
    if (disableRightSwipe || disabled) return;

    // Set transitioning to true before the action
    setTransitioning(true);

    // Check if a right swipe confirmation callback exists
    if (onRightSwipeConfirm) {
      // Execute the right swipe confirmation callback
      onRightSwipeConfirm(() => {
        // Set transitioning to false after the action is done
        setTransitioning(false);
        // Trigger actions on right swipe confirmed
        onRightSwipeConfirmed();
      }, onSwipeCancel);
    } else {
      // Set transitioning to false after the action is done
      setTransitioning(false);
      // Trigger actions on right swipe confirmed
      onRightSwipeConfirmed();
    }
  }, [
    onRightSwipeConfirm,
    onRightSwipeConfirmed,
    onSwipeCancel,
    disableRightSwipe,
    disabled,
  ]);

  // Effect hook to handle transitions
  useEffect(() => {
    // Callback function to handle the transition end event
    const handleTransitionEnd = () => {
      // Set transitioning to false when the transition ends
      setTransitioning(false);
    };

    // Get the reference to the container element
    const root = container.current;

    // Add an event listener for the 'transitionend' event
    root?.addEventListener('transitionend', handleTransitionEnd);

    // Clean up by removing the event listener when the component unmounts
    return () => {
      root?.removeEventListener('transitionend', handleTransitionEnd);
    };
  }, []);

  const onMouseUp = useCallback(
    function () {
      // Reset the starting touch position
      startTouchPosition.current = 0;

      // Define the acceptable move thresholds for left and right swipes
      const acceptableMoveLeft = -swipeWidth * 0.7;
      const acceptableMoveRight = swipeWidth * 0.7;

      // Determine whether to show the left and right swipes based on the current translate value
      const showSwipeLeft = showSwipeAction
        ? translate < acceptableMoveLeft
        : false;
      const showSwipeRight = showSwipeAction
        ? translate > acceptableMoveRight
        : false;

      // Determine if neither left nor right swipe should be shown
      const notShowSwipe = showSwipeAction
        ? translate >= acceptableMoveLeft && translate <= acceptableMoveRight
        : true;

      // Determine if the swipe without confirmation threshold is reached
      const swipeWithoutConfirm =
        (swipeDirection === 'right' ? 1 : -1) * translate >=
        swipeWithoutConfirmThreshold;

      // Update the translate value based on the conditions
      if (swipeWithoutConfirm) {
        setTranslate(() => translate);
      } else if (notShowSwipe) {
        setTranslate(() => 0);
      } else if (
        (showSwipeLeft && !swipeWithoutConfirm) ||
        (showSwipeRight && !swipeWithoutConfirm)
      ) {
        setTranslate(() => (swipeDirection === 'right' ? 1 : -1) * swipeWidth);
      }

      // Set touching to false to indicate the end of the touch/mouse interaction
      setTouching(() => false);

      // Trigger left or right swipe action if swipeWithoutConfirm condition is met
      if (swipeWithoutConfirm) {
        swipeDirection === 'left' ? onLeftSwipeClick() : onRightSwipeClick();
      }
    },
    [
      containerWidth,
      swipeWidth,
      swipeWithoutConfirmThreshold,
      onLeftSwipeClick,
      onRightSwipeClick,
      translate,
      showSwipeAction,
    ]
  );

  useEffect(() => {
    // Attach or detach event listeners based on the touching state
    if (touching) {
      // Add event listeners for mouse and touch events
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchend', onMouseUp);
    } else {
      // Remove event listeners for mouse and touch events
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    }

    // Cleanup: Remove event listeners when the component unmounts or when touching changes
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchend', onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, touching]);

  const classNameContainer = () => {
    // Determine the container class based on swipe direction, swiping state, and destructive swipe settings
    if (swipeDirection === 'left') {
      const name = `swiper${
        leftSwiping && destructiveLeftSwipe ? ' leftSwiping' : ''
      } ${className}`;
      return name;
    } else {
      const name = `swiper${
        rightSwiping && destructiveRightSwipe ? ' rightSwiping' : ''
      } ${className}`;
      return name;
    }
  };

  const classNameContent = () => {
    // Determine the content class based on swipe direction, swiping state, transitioning, and touching states
    if (swipeDirection === 'left') {
      const name = `content${
        leftSwiping && destructiveLeftSwipe ? ' leftSwiping' : ''
      }${transitioning ? ' transitioning' : ''}${
        !touching ? ' transition' : ''
      }`;
      return name;
    } else {
      const name = `content${
        rightSwiping && destructiveRightSwipe ? ' rightSwiping' : ''
      }${transitioning ? ' transitioning' : ''}${
        !touching ? ' transition' : ''
      }`;
      return name;
    }
  };

  return (
    <div id={id} className={classNameContainer()} ref={container}>
      {/* Do not add left button if left swipe is disabled */}
      {!disableLeftSwipe && (
        <div className={`leftSwipe${leftSwiping ? ' leftSwiping' : ''}`}>
          <button onClick={onLeftSwipeClick}>
            {leftSwipeComponent ? leftSwipeComponent : leftSwipeText}
          </button>
        </div>
      )}

      {/* Do not add right button if right swipe is disabled */}
      {!disableRightSwipe && (
        <div className={`rightSwipe${rightSwiping ? ' rightSwiping' : ''}`}>
          <button onClick={onRightSwipeClick}>
            {rightSwipeComponent ? rightSwipeComponent : rightSwipeText}
          </button>
        </div>
      )}

      <div
        className={classNameContent()}
        onMouseDown={onStart}
        onTouchStart={onStart}
      >
        {children}
      </div>
    </div>
  );
};

export default Swipe;
