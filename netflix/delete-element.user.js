// ==UserScript==
// @name         Delete Element
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Delete Element (with undo)
// @author       Josh Parker
// @match        http*://**/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qwant.com
// @grant        none
// ==/UserScript==

(function deleteElement() {
  const remove = (element) => { element.style.setProperty('display', 'none'); };

  // let prevBoxShadow;

  const addBorder = (element) => {
    // prevBoxShadow = element.style.getPropertyValue('box-shadow');
    element.style.setProperty('box-shadow', '0px 0px 1px 1px red');
  };

  const removeBorder = (element) => {
    element.style.removeProperty('box-shadow');
    /*
    if (prevBoxShadow) {
      element.style.setProperty('box-shadow', prevBoxShadow);
    } */
  };

  const elementStack = [];
  let hoveredElement;

  // eslint-disable-next-line no-extend-native
  Array.prototype.peek = function peek() { return this[this.length - 1]; };

  // not pressing d
  const mouseoverHandler = ({ target }) => {
    hoveredElement = target;
  };

  // pressing d
  const mouseoverHandlerWithBorder = ({ target }) => {
    removeBorder(hoveredElement);
    hoveredElement = target;
    addBorder(hoveredElement);
  };

  const clickHandler = (event) => {
    event.preventDefault();
    const { target } = event;
    elementStack.push(target);
    remove(target);
  };

  const undo = () => {
    const element = elementStack.pop();
    element?.style.removeProperty('display');
  };

  const { body } = document;
  body.addEventListener('mouseover', mouseoverHandler);

  document.addEventListener('keydown', ({ code }) => {
    if (code === 'KeyD') {
      body.removeEventListener('mouseover', mouseoverHandler);
      body.addEventListener('mouseover', mouseoverHandlerWithBorder);
      document.addEventListener('click', clickHandler);
      addBorder(hoveredElement);
    }

    if (code === 'KeyZ') {
      undo();
    }
  });

  document.addEventListener('keyup', ({ code }) => {
    if (code === 'KeyD') {
      document.removeEventListener('click', clickHandler);
      body.addEventListener('mouseover', mouseoverHandler);
      body.removeEventListener('mouseover', mouseoverHandlerWithBorder);
      removeBorder(hoveredElement);
    }
  });
}());
