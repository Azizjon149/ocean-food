
/* =========================
   OCEAN FOOD CUSTOM CURSOR
========================= */

const customCursor = document.getElementById("custom-cursor");
const cursorImage = customCursor?.querySelector("img");

let mouseX = 0;
let mouseY = 0;

let cursorX = 0;
let cursorY = 0;


/* =========================
   CURSOR IMAGES
========================= */

const normalCursor = "images/cursor.png";
const textCursor = "images/text-cursor.png";


/* =========================
   CURSOR MOVEMENT
========================= */

if (customCursor && cursorImage) {

    document.addEventListener("mousemove", (event) => {

        mouseX = event.clientX;
        mouseY = event.clientY;

    });


    function animateCursor() {

        cursorX +=
            (mouseX - cursorX) * 0.18;

        cursorY +=
            (mouseY - cursorY) * 0.18;

        customCursor.style.left =
            `${cursorX}px`;

        customCursor.style.top =
            `${cursorY}px`;

        requestAnimationFrame(
            animateCursor
        );

    }

    animateCursor();


    /* =========================
       TEXT CURSOR
    ========================= */

    const textElements =
        document.querySelectorAll(
            "input[type='text'], " +
            "input:not([type]), " +
            "textarea, " +
            "[contenteditable='true']"
        );


    textElements.forEach((element) => {

        element.addEventListener(
            "mouseenter",
            () => {

                cursorImage.src =
                    textCursor;

            }
        );


        element.addEventListener(
            "mouseleave",
            () => {

                cursorImage.src =
                    normalCursor;

            }
        );

    });

}


/* =========================
   LIVE FONT PREVIEW
========================= */

const input =
    document.querySelector(".font-input");

const preview =
    document.querySelector(".preview");


if (input && preview) {

    input.addEventListener(
        "input",
        () => {

            const value =
                input.value.trim();


            if (value === "") {

                preview.textContent =
                    "Ocean Food";

                return;
            }


            preview.textContent =
                value;

        }
    );

}


/* =========================
   MOBILE SWIPE TRAIL
========================= */

const swipeEffect =
    document.getElementById(
        "swipe-effect"
    );

let swipeActive = false;

let lastX = 0;
let lastY = 0;

const SWIPE_SIZE = 22;


/* =========================
   CREATE SWIPE DOT
========================= */

function createSwipeDot(x, y) {

    if (!swipeEffect) return;


    const dot =
        document.createElement("div");


    dot.className =
        "swipe-dot";


    dot.style.left =
        `${x}px`;


    dot.style.top =
        `${y}px`;


    swipeEffect.appendChild(dot);

}


/* =========================
   CREATE SWIPE SEGMENT
========================= */

function createSwipeSegment(
    x1,
    y1,
    x2,
    y2
) {

    if (!swipeEffect) return;


    const segment =
        document.createElement("div");


    segment.className =
        "swipe-segment";


    const dx =
        x2 - x1;


    const dy =
        y2 - y1;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    const angle =
        Math.atan2(dy, dx) *
        180 /
        Math.PI;


    segment.style.width =
        `${distance}px`;


    segment.style.height =
        `${SWIPE_SIZE}px`;


    segment.style.left =
        `${x1}px`;


    segment.style.top =
        `${y1}px`;


    segment.style.transform =
        `translateY(-50%) rotate(${angle}deg)`;


    swipeEffect.appendChild(
        segment
    );

}


/* =========================
   TOUCH START
========================= */

function startSwipe(event) {

    if (!event.touches) return;

    if (event.touches.length !== 1) {
        return;
    }


    const touch =
        event.touches[0];


    swipeActive = true;


    lastX =
        touch.clientX;


    lastY =
        touch.clientY;


    createSwipeDot(
        lastX,
        lastY
    );

}


/* =========================
   TOUCH MOVE
========================= */

function moveSwipe(event) {

    if (!swipeActive) return;

    if (!event.touches) return;

    if (event.touches.length !== 1) {
        return;
    }


    const touch =
        event.touches[0];


    const x =
        touch.clientX;


    const y =
        touch.clientY;


    const dx =
        x - lastX;


    const dy =
        y - lastY;


    const distance =
        Math.sqrt(
            dx * dx +
            dy * dy
        );


    if (distance < 4) {
        return;
    }


    createSwipeSegment(
        lastX,
        lastY,
        x,
        y
    );


    lastX = x;
    lastY = y;

}


/* =========================
   TOUCH END
========================= */

function endSwipe() {

    if (!swipeActive) {
        return;
    }


    swipeActive = false;


    if (!swipeEffect) {
        return;
    }


    const elements = [
        ...swipeEffect.children
    ];


    elements.forEach(
        (element) => {

            element.classList.add(
                "swipe-fade"
            );


            setTimeout(
                () => {

                    if (
                        element.parentNode
                    ) {

                        element.remove();

                    }

                },
                450
            );

        }
    );

}


/* =========================
   TOUCH EVENTS
========================= */

document.addEventListener(
    "touchstart",
    startSwipe,
    {
        passive: true
    }
);


document.addEventListener(
    "touchmove",
    moveSwipe,
    {
        passive: true
    }
);


document.addEventListener(
    "touchend",
    endSwipe,
    {
        passive: true
    }
);


document.addEventListener(
    "touchcancel",
    endSwipe,
    {
        passive: true
    }
);

