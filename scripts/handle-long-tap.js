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
 * Sets up the touchstart event handler to trigger long-tap detection.
 * Activates dragging after a 2-second hold on small screens.
 *
 * @param {HTMLElement} card - The task card element to apply the handler to.
 */
function initTouchStart(card) {
  card.ontouchstart = function (e) {
    if (window.innerWidth >= 768) return;

    card.longTapTimer = setTimeout(() => {
      card.isDragging = true;
      activateDragStyle(card);
    }, 2000);
  };
}

/**
 * Applies styling to visually indicate that the card is being dragged.
 *
 * @param {HTMLElement} card - The task card currently being dragged.
 */
function activateDragStyle(card) {
  card.style.position = "absolute";
  card.style.zIndex = 999;
  card.classList.add("tilted");
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
 * Updates the card position to follow the touch point.
 *
 * @param {HTMLElement} card - The card being dragged.
 * @param {Touch} touch - The current touch point data.
 */
function positionCardOnTouch(card, touch) {
  card.style.left = `${touch.pageX - card.offsetWidth / 2}px`;
  card.style.top = `${touch.pageY - card.offsetHeight / 2}px`;
}

/**
 * Automatically scrolls the page up or down when dragging near screen edges.
 *
 * @param {Touch} touch - The current touch point data.
 */
function handleAutoScroll(touch) {
  if (touch.clientY < 100) window.scrollBy(0, -10);
  else if (touch.clientY > window.innerHeight - 100) window.scrollBy(0, 10);
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
 * Resets the styling on a card after dragging ends.
 *
 * @param {HTMLElement} card - The task card element to reset.
 */
function resetDragStyle(card) {
  card.classList.remove("tilted");
  card.style = "";
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