import type { CustomWindow } from "@/lib/overrides";
import pd from "packery";
import { type Packery } from "packery";

const container = document.querySelector("#container") as HTMLElement | null;
const parentContainer = container?.parentElement as HTMLElement | null;
if (container) {
  const pky = pd as unknown as typeof Packery;
  const p = new pky(container, {
    itemSelector: "li[data-work-container]",
    transitionDuration: 0,
  });
  (window as CustomWindow).pky = p;


  parentContainer?.scrollTo(container.clientWidth / 2 - window.innerWidth / 2, container.clientHeight / 2 - window.innerHeight / 2);
  if (document.querySelector('[data-work].selected')) {
    document.querySelector('[data-work].selected')?.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
  }
}

if (parentContainer) {
  let isDragging = false;
  let startX = 0,
    startY = 0,
    scrollLeft = 0,
    scrollTop = 0;

  const mouseDownHandler = (e: MouseEvent) => {
    if (document.querySelector('[data-work].expanded')) return;
    startX = e.clientX;
    startY = e.clientY;
    scrollLeft = parentContainer.scrollLeft;
    scrollTop = parentContainer.scrollTop;

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = (e: MouseEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isDragging) {
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
        isDragging = true;
        parentContainer.classList.add("moving");
      } else {
        return; // Not enough movement to start dragging
      }
    }

    parentContainer.scrollLeft = scrollLeft - dx;
    parentContainer.scrollTop = scrollTop - dy;
  };

  const mouseUpHandler = () => {
    isDragging = false;
    parentContainer.classList.remove("moving");
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  parentContainer.addEventListener("mousedown", mouseDownHandler, {
    passive: true,
  });
  // parentContainer.addEventListener("wheel", (e) => e.preventDefault(), {
  //   passive: false,
  // });
}