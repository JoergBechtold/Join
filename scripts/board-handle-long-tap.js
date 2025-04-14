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
 * Startet das lange Drücken und speichert Fingerposition.
 * @param {HTMLElement} card - Die Karte, die berührt wird.
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
 * Aktiviert den Drag-Stil mit Positionierung relativ zur Berührungsstelle.
 * @param {HTMLElement} card - Die Karte, die gezogen wird.
 */
function activateDragStyle(card) {
  card.style.position = 'fixed';
  card.style.zIndex = 999;
  card.style.pointerEvents = 'none';
  card.style.width = `${card.offsetWidth}px`;
  card.classList.add('tilted');
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
 * Positioniert die Karte unter dem Finger, egal wo sie gedrückt wurde.
 * @param {HTMLElement} card - Die gezogene Karte.
 * @param {Touch} touch - Die aktuelle Touch-Position.
 */
function positionCardOnTouch(card, touch) {
  const rect = card.getBoundingClientRect();
  const offsetX = card.dragOffsetX || rect.width / 2;
  const offsetY = card.dragOffsetY || rect.height / 2;
  card.style.left = `${touch.clientX - offsetX}px`;
  card.style.top = `${touch.clientY - offsetY}px`;
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