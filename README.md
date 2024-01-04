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

| Prop                  | Type        | Default                                    |
| --------------------- | ----------- | ------------------------------------------ |
| onLeftSwipe           | function    | null                                       |
| onLeftSwipeConfirm    | function    | null                                       |
| leftSwipeComponent    | node        | null (_Text or leftSwipeComponent_)        |
| onRightSwipe          | function    | null                                       |
| onRightSwipeConfirm   | function    | null                                       |
| rightSwipeComponent   | node        | null (_Text or rightSwipeComponent_)       |
| height                | number      | 50                                         |
| transitionDuration    | number (ms) | 250                                        |
| swipeWidth            | number (px) | 75                                         |
| swipeThreshold        | number (%)  | 75                                         |
| showDeleteAction      | bool        | true                                       |
| leftSwipeColor        | string      | 'rgba(252, 255, 148, 1.00)'                |
| leftSwipeText         | string      | "Delete" (_deleteText or deleteComponent_) |
| rightSwipeColor       | string      |'rgba(252, 254, 250, 1.00)'                 |
| rightSwipeText        | string      | "Edit" (_Text or rightSwipeComponent_)     |
| disabled              | bool        | false                                      |
| disableLeftSwipe      | bool        | false                                      |
| disableRightSwipe     | bool        | false                                      |
| destructiveLeftSwipe  | bool        | false                                      |
| destructiveRightSwipe | bool        | false                                      |
| id                    | string      | ''                                         |
| className             | string      | ''                                         |
| onSwipeStateCompleted | function    | null                                       |

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
