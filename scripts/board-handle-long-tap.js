let scrolling = false;
let cardScrollDirection = 0;

/**
 * Initializes the touch-based drag functionality for a task card.
 * Delegates to specific setup functions for touch start, move, and end.
 *
 * @param {HTMLElement} card - The task card element to apply drag behavior to.
 */
function setupTouchDrag(card) {
  initTouchStart(card);
  initTouchMove(card);
  initTouchEnd(card);
}
/**
 * Starts long tap detection and stores initial finger offset.
 * @param {HTMLElement} card - The task card element.
 */
function initTouchStart(card) {
  card.ontouchstart = function (e) {
    if (window.innerWidth >= 768) return;
    const touch = e.touches[0];
    const rect = card.getBoundingClientRect();
    card.dragOffsetX = touch.clientX - rect.left;
    card.dragOffsetY = touch.clientY - rect.top;
    card.longTapTimer = setTimeout(() => {
      card.isDragging = true;
      activateDragStyle(card);
    }, 500);
  };
}

/**
 * Applies styles for dragging behavior and disables scrolling globally.
 * @param {HTMLElement} card - The card being dragged.
 */
function activateDragStyle(card) {
  const rect = card.getBoundingClientRect();
  card.style.position = 'fixed';
  card.style.zIndex = 999;
  card.style.left = `${rect.left}px`;
  card.style.top = `${rect.top}px`;
  card.style.width = `${rect.width}px`;
  card.style.height = `${rect.height}px`;
  card.style.pointerEvents = 'none';
  card.classList.add('tilted');
  document.querySelector('.main-board').classList.add('no-scroll');
  document.body.classList.add('body-no-scroll');
  document.documentElement.classList.add('body-no-scroll');
}

/**
 * Sets up the ontouchmove event to update the card position during dragging.
 *
 * @param {HTMLElement} card - The task card element being moved.
 */
function initTouchMove(card) {
  card.ontouchmove = function (e) {
    if (!card.isDragging) return;
    const touch = e.touches[0];
    positionCardOnTouch(card, touch);
    handleAutoScroll(touch);
  };
}

/**
 * Updates card position based on finger movement.
 * @param {HTMLElement} card - The card being dragged.
 * @param {Touch} touch - The current touch position.
 */
function positionCardOnTouch(card, touch) {
  const offsetX = card.dragOffsetX || 0;
  const offsetY = card.dragOffsetY || 0;
  card.style.left = `${touch.clientX - offsetX}px`;
  card.style.top = `${touch.clientY - offsetY}px`;
}

/**
 * Smoothly scrolls .main-board while finger is near top/bottom edge.
 * @param {Touch} touch - The current touch position.
 */
function handleAutoScroll(touch) {
  const board = document.querySelector('.main-board');
  const rect = board.getBoundingClientRect();
  const topEdge = rect.top + 50;
  const bottomEdge = rect.bottom - 50;

  cardScrollDirection = 0;
  if (touch.clientY < topEdge) cardScrollDirection = -1;
  else if (touch.clientY > bottomEdge) cardScrollDirection = 1;

  if (!scrolling) startSmoothScroll(board);
}

/**
 * Starts smooth scroll animation in the desired direction.
 * @param {HTMLElement} board - The board container.
 */
function startSmoothScroll(board) {
  scrolling = true;
  function scroll() {
    if (cardScrollDirection !== 0) {
      board.scrollTop += cardScrollDirection * 200;
      requestAnimationFrame(scroll);
    } else {
      scrolling = false;
    }
  }
  scroll();
}

/**
 * Sets up the ontouchend event to drop the dragged card into a valid column.
 *
 * @param {HTMLElement} card - The card that is being dragged and released.
 */
function initTouchEnd(card) {
  card.ontouchend = function (e) {
    clearTimeout(card.longTapTimer);
    if (!card.isDragging) return;

    card.isDragging = false;
    resetDragStyle(card);

    const touch = e.changedTouches[0];
    const dropColumn = getDropTarget(touch);
    if (dropColumn) {
      currentDraggedElement = card.id;
      moveTo(dropColumn.id);
    }
  };
}

/**
 * Resets the card styles and re-enables scrolling globally.
 * @param {HTMLElement} card - The task card element to reset.
 */
function resetDragStyle(card) {
  card.classList.remove('tilted');
  card.style = '';
  document.querySelector('.main-board').classList.remove('no-scroll');
  document.body.classList.remove('body-no-scroll');
  document.documentElement.classList.remove('body-no-scroll');
}

/**
 * Returns the nearest drag-area column based on the touch release point.
 *
 * @param {Touch} touch - The touch point on release.
 * @returns {HTMLElement|null} The drop target column or null if none.
 */
function getDropTarget(touch) {
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  return target?.closest(".drag-area");
}