function setupTouchDrag(card) {
  initTouchStart(card);
  initTouchMove(card);
  initTouchEnd(card);
}

function initTouchStart(card) {
  card.ontouchstart = function (e) {
    if (window.innerWidth >= 768) return;

    card.longTapTimer = setTimeout(() => {
      card.isDragging = true;
      activateDragStyle(card);
    }, 2000);
  };
}

function activateDragStyle(card) {
  card.style.position = "absolute";
  card.style.zIndex = 999;
  card.classList.add("tilted");
}

function initTouchMove(card) {
  card.ontouchmove = function (e) {
    if (!card.isDragging) return;
    const touch = e.touches[0];
    positionCardOnTouch(card, touch);
    handleAutoScroll(touch);
  };
}

function positionCardOnTouch(card, touch) {
  card.style.left = `${touch.pageX - card.offsetWidth / 2}px`;
  card.style.top = `${touch.pageY - card.offsetHeight / 2}px`;
}

function handleAutoScroll(touch) {
  if (touch.clientY < 100) window.scrollBy(0, -10);
  else if (touch.clientY > window.innerHeight - 100) window.scrollBy(0, 10);
}

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

function resetDragStyle(card) {
  card.classList.remove("tilted");
  card.style = "";
}

function getDropTarget(touch) {
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  return target?.closest(".drag-area");
}
