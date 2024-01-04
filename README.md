# Swiper

![Version](https://img.shields.io/badge/version-1.0.0-blue)


A versatile React component designed to emulate the seamless iOS item-swiping experience in a list, offering extensive customization options for effortless integration and tailored user interactions.

Swipe with and without confirmation:

![GIF Demo](./demo_2.gif?raw=true "Title")

Callback that notifies that the swipe is completed (can be used to disable/enable user interaction with child content if needed)
Do not have limitations for the width and height of a swipeable child container. 

![GIF Demo](./demo_1.gif?raw=true "Title")


## Installation

Manually copy files from /src folder to your project

## Usage Example

```js
import Swipe from './Swipe.components.tsx';
import '../components/styles/styles.css';
...

.swiper-food {
  border-radius: 10px;
  margin: 5px;
}
...

 <Swipe
    height={50}
    disabled={!food.isCustom}
    onLeftSwipe={deleteFood}
    leftSwipeComponent={
      <Image imageName={`delete.svg`} width="25" height="25" />
    }
    onLeftSwipeConfirm={(onSuccess, onCancel) => {
      if (window.confirm('Do you really want to delete this food?')) {
        onSuccess();
      } else {
        onCancel();
      }
    }}
    distructiveLeftSwipe={true}
    disableRightSwipe={true}
    onRightSwipe={editFood}
    rightSwipeComponent={
      <Image imageName={`edit.svg`} width="20" height="20" />
    }
    className="swiper-food"
    leftSwipeColor={colors.orange}
    rightSwipeColor={colors.green}
    onSwipeStateCompleted={(completed ) => {
      setSwipeCompleted(completed);
    }}
  >
  {children}
  </Swipe>
```

## Props

| Prop                  | Type        | Default                                    | Description                                                             |
| --------------------- | ----------- | ------------------------------------------ | ------------------------------------------------------------------------
| onLeftSwipe           | function    | null                                       | Callback when the left swipe is completed                               |
| onLeftSwipeConfirm    | function    | null                                       | Callback on left swipe confirmation                                     |
| leftSwipeComponent    | node        | null (_Text or leftSwipeComponent_)        | Used to set the left swipe component (button, icon)                     |
| onRightSwipe          | function    | null                                       | Callback when the right swipe is completed                              |
| onRightSwipeConfirm   | function    | null                                       | Callback on right swipe confirmation                                    |
| rightSwipeComponent   | node        | null (_Text or rightSwipeComponent_)       | Used to set the right swipe component (button, icon)                    |
| height                | number      | 50                                         | Allows setting the height for the entire swipe component                |
| transitionDuration    | number (ms) | 250                                        | Sets animation duration                                                 |
| swipeWidth            | number (px) | 75                                         | Sets the visible width of the swipe component under the child (content) |
| swipeThreshold        | number (%)  | 50                                         | Sets the threshold for swipe (as a percentage of the child's width)     |
| showDeleteAction      | bool        | true                                       | If false, only full swipe is available                                  |
| leftSwipeColor        | string      | 'rgba(252, 255, 148, 1.00)'                | Sets the left swipe background color                                    |
| leftSwipeText         | string      | "Delete" (_deleteText or deleteComponent_) | Sets the left swipe text                                                |
| rightSwipeColor       | string      |'rgba(252, 254, 250, 1.00)'                 | Sets the right swipe background color                                   |
| rightSwipeText        | string      | "Edit" (_Text or rightSwipeComponent_)     | Sets the right swipe text                                               |
| disabled              | bool        | false                                      | Disables both right and left swipes                                     | 
| disableLeftSwipe      | bool        | false                                      | Disables the left swipe                                                 |
| disableRightSwipe     | bool        | false                                      | Disables the right swipe                                                |
| destructiveLeftSwipe  | bool        | false                                      | Applies destructive animation for the left swipe                        |
| destructiveRightSwipe | bool        | false                                      | Applies destructive animation for the right swipe                       |
| id                    | string      | ''                                         | Callback that notifies that the swipe is completed                      |   
| className             | string      | ''                                         |                                                                         |
| onSwipeStateCompleted | function    | null                                       |                                                                         |

## Component structure

The component structure might help you customize with your own CSS.

```jsx
<div id={id} className={classNameContainer()} ref={container}>
  {/* Do not add a left button if left swipe is disabled */}
  {!disableLeftSwipe && (
    <div className={`leftSwipe${leftSwiping ? ' leftSwiping' : ''}`}>
      <button onClick={onLeftSwipeClick}>
        {leftSwipeComponent ? leftSwipeComponent: leftSwipeText}
      </button>
    </div>
  )}

  {/* Do not add a right button if right swipe is disabled */}
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
```
