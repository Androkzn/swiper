import React, { useCallback, useEffect, useRef, useState } from "react";
import '../swiper.css';

export interface Props {
  onLeftSwipe: Function;
  onLeftSwipeConfirm?: Function;
  leftSwipeComponent?: React.ReactNode;
  onRightSwipe: Function;
  onRightSwipeConfirm?: Function;
  rightSwipeComponent?: React.ReactNode;
  disabled?: boolean;
  height?: number;
  transitionDuration?: number;
  swipeWidth?: number;  
  swipeThreshold?: number; 
  showSwipeAction?: boolean; 
  leftSwipeColor?: string;  
  leftSwipeText?: string; 
  rightSwipeColor?: string;  
  rightSwipeText?: string;  
  className?: string;
  id?: string;
  disableLeftSwipe?: boolean;
  disableRightSwipe?: boolean;
  distructiveLeftSwipe?: boolean;
  distructiveRightSwipe?: boolean;
  children?: React.ReactNode;
}

const cursorPosition = (event: any) => {
  if (event?.touches?.[0]?.clientX) return event.touches[0].clientX;
  if (event?.clientX) return event?.clientX;
  if (event?.nativeEvent?.touches?.[0]?.clientX) return event.nativeEvent.touches[0].clientX;
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
  leftSwipeColor = "rgba(252, 255, 148, 1.00)",  
  leftSwipeText = "Edit",
  rightSwipeColor= "rgba(252, 254, 250, 1.00)",
  rightSwipeText = "Delete",
  className = "",
  id = "",
  disableLeftSwipe = false,
  disableRightSwipe = false,
  distructiveLeftSwipe = false,
  distructiveRightSwipe = false,
  children,
}: Props) => {
  const [touching, setTouching] = useState(false);
  const [translate, setTranslate] = useState(0);
  const [leftSwiping, setLeftSwiping] = useState(false);
  const [rightSwiping, setRightSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState("");
  const [transitioning, setTransitioning] = useState(false);
  
  const startTouchPosition = useRef(0);
  const initTranslate = useRef(0);
  const container = useRef<HTMLDivElement>(null);
  const containerWidth: number = container.current?.getBoundingClientRect().width || 0;
  const swipeWithoutConfirmThreshold: number = containerWidth * (swipeThreshold / 100);  

  const onStart = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;
      if (touching) return;
      startTouchPosition.current = cursorPosition(event);
      initTranslate.current = translate;
      setTouching(true);
    },
    [disabled, touching, translate]
  );

  useEffect(() => {
    const root = container.current;
    root?.style.setProperty("--swiperHeight", height + "px");
    root?.style.setProperty("--swiperTransitionDuration", transitionDuration + "ms");
    root?.style.setProperty("--swiperLeftColor", leftSwipeColor); 
    root?.style.setProperty("--swiperRightColor", rightSwipeColor);   
    root?.style.setProperty("--swiperSwipeWidth", swipeWidth + "px"); 
  }, [leftSwipeColor, rightSwipeColor, swipeWidth, height, transitionDuration]);

  useEffect(() => {
    const root = container.current;
    root?.style.setProperty("--visibilityLeft", swipeDirection === "left" ? "visible" : "hidden"); 
    root?.style.setProperty("--visibilityRight", swipeDirection === "right" ? "visible" : "hidden"); 
  }, [swipeDirection]);


  useEffect(() => {
    const root = container.current;
    root?.style.setProperty("--swiperTranslate", translate  + "px");
  }, [translate, swipeWidth, containerWidth, swipeWithoutConfirmThreshold]);

  const onMove = useCallback(
    function (event: TouchEvent | MouseEvent) {
      if (!touching) return;
      const currentPosition = cursorPosition(event);
      const moveDistance = currentPosition - startTouchPosition.current;
      setSwipeDirection(moveDistance >=0 ? "right" : "left")
      setTranslate(moveDistance);
    },
    [touching]
  );

  const onMouseMove = useCallback(
    function (event: MouseEvent): any {
      onMove(event);
    },
    [onMove]
  );

  const onTouchMove = useCallback(
    function (event: TouchEvent): any {
      onMove(event);
    },
    [onMove]
  );

  const onLeftSwipeConfirmed = useCallback(() => {
    onSwipeCancel()
    setLeftSwiping(() => true);
    window.setTimeout(onLeftSwipe, transitionDuration);
  }, [onLeftSwipe, transitionDuration]);

  const onRightSwipeConfirmed = useCallback(() => {
     onSwipeCancel()
     setRightSwiping(() => true);
     window.setTimeout(onRightSwipe, transitionDuration);
  }, [onRightSwipe, transitionDuration]);

  
  const onSwipeCancel = useCallback(() => {
    setTouching(() => false);
    setTranslate(() => 0);
    setLeftSwiping(() => false);
    setRightSwiping(() => false);
    startTouchPosition.current = 0;
    initTranslate.current = 0;
  }, [onLeftSwipe, onRightSwipe, transitionDuration]);

  const onLeftSwipeClick = useCallback(() => {
    if (disableLeftSwipe || disabled) return;
    setTransitioning(true); // Set transitioning to true before the action
    if (onLeftSwipeConfirm) {
      onLeftSwipeConfirm(() => {
        setTransitioning(false); // Set transitioning to false after the action is done
        onLeftSwipeConfirmed();
      }, onSwipeCancel);
    } else {
      setTransitioning(false);
      onLeftSwipeConfirmed();
    }
  }, [onLeftSwipeConfirm, onLeftSwipeConfirmed, onSwipeCancel, disableLeftSwipe]);

  const onRightSwipeClick = useCallback(() => {
    if (disableRightSwipe || disabled) return; 
    setTransitioning(true); // Set transitioning to true before the action
    if (onRightSwipeConfirm) {
      onRightSwipeConfirm(() => {
        setTransitioning(false); // Set transitioning to false after the action is done
        onRightSwipeConfirmed()
      }, onSwipeCancel);
    } else {
      setTransitioning(false); // Set transitioning to false after the action is done
      onRightSwipeConfirmed()
    }
  }, [onRightSwipeConfirm, onRightSwipe, onSwipeCancel,disableRightSwipe, disabled]);

  useEffect(() => {
    const handleTransitionEnd = () => {
      setTransitioning(false);
    };
  
    const root = container.current;
    root?.addEventListener("transitionend", handleTransitionEnd);
  
    return () => {
      root?.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, []);


  const onMouseUp = useCallback(
    function () {
      startTouchPosition.current = 0;
      const acceptableMoveLeft = -swipeWidth * 0.7;
      const acceptableMoveRight = swipeWidth * 0.7;
      const showSwipeLeft = showSwipeAction ?  translate < acceptableMoveLeft : false;
      const showSwipeRight = showSwipeAction ?  translate > acceptableMoveRight : false;
      const notShowSwipe = showSwipeAction ?  translate >= acceptableMoveLeft &&  translate <= acceptableMoveRight : true;
      const swipeWithoutConfirm = (swipeDirection === "right" ? 1 : -1) * translate >= swipeWithoutConfirmThreshold;
      if (swipeWithoutConfirm) {
        setTranslate(() => translate)
      } else if (notShowSwipe) {
        setTranslate(() => 0);
      } else if (showSwipeLeft && !swipeWithoutConfirm) {
        setTranslate(() => (swipeDirection === "right" ? 1 : -1) * swipeWidth);
      } else if (showSwipeRight && !swipeWithoutConfirm) {
        setTranslate(() => (swipeDirection === "right" ? 1 : -1) * swipeWidth);
      }
 
      setTouching(() => false);

      if (swipeWithoutConfirm) {
         swipeDirection === "left" ?  onLeftSwipeClick() : onRightSwipeClick()
      }
    },
    [containerWidth, swipeWidth, swipeWithoutConfirmThreshold, onLeftSwipeClick, onRightSwipeClick, translate, showSwipeAction]
  );

  useEffect(() => {
    if (touching) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchend", onMouseUp);
    } else {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, touching]);

  const classNameContainer = () => {
    if (swipeDirection === "left")  {
      const name = `swiper${leftSwiping && distructiveLeftSwipe ? " leftSwiping" : ""} ${className}`
      return name
    } else {
      const name = `swiper${rightSwiping && distructiveRightSwipe? " rightSwiping" : ""} ${className}`
      return name
    }
  } 

  const classNameContent = () => {
    if (swipeDirection === "left")  {
      const name = `content${leftSwiping && distructiveLeftSwipe ? " leftSwiping" : ""}${transitioning ? " transitioning" : ""}${!touching ? " transition" : ""}`
      return name
    } else {
      const name = `content${rightSwiping && distructiveRightSwipe ? " rightSwiping" : ""}${transitioning ? " transitioning" : ""}${!touching ? " transition" : ""}`
      return name
    }
  } 

  return (
    <div id={id} className={ classNameContainer() } ref={container}>
      
      {/* Do not add left button if left swipe is disabled */}
      {!disableLeftSwipe && 
      <div className={`leftSwipe${leftSwiping ? " leftSwiping" : ""}`}>
        <button onClick={onLeftSwipeClick}>{leftSwipeComponent ? leftSwipeComponent : leftSwipeText}</button>
      </div>
      }
      
      {/* Do not add right button if right swipe is disabled */}
      { !disableRightSwipe && 
      <div className={`rightSwipe${rightSwiping ? " rightSwiping" : ""}`}>
        <button onClick={onRightSwipeClick}>{rightSwipeComponent ? rightSwipeComponent : rightSwipeText}</button>
      </div>
      }

      <div
        className={classNameContent()}
        onMouseDown={onStart}
        onTouchStart={onStart}>
        {children}
      </div>
       
    </div>
  );
};

export default Swipe;
