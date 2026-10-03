/* ==========================================================
   OCEAN FOOD CUSTOM CURSOR + TOUCH TRAIL

   Tuzatish:
   - hover/pointer media query'ga bog'lanmaydi.
   - haqiqiy mouse pointer (pointerType === "mouse") kelganda
     custom cursor avtomatik yoqiladi.
   - planshetga mouse ulanganida ham ishlaydi.
   - touch ekranida custom cursor yoqilmaydi.
   - input/textarea/contenteditable uchun text cursor ishlaydi.
   ========================================================== */

(function () {
    "use strict";

    const root = document.documentElement;
    const cursor = document.getElementById("custom-cursor");
    const image = cursor ? cursor.querySelector("img") : null;

    if (!cursor || !image) {
        console.warn("[Ocean Food] Custom cursor element topilmadi.");
    }

    /* ----------------------------------------------------------
       CURSOR
       ---------------------------------------------------------- */

    const SRC = {
        normal: "images/cursor-sm.png",
        text: "images/text-cursor-sm.png"
    };

    const CLICKABLE =
        "a, button, [role='button'], [role='radio'], " +
        "summary, label[for], .interactive, .hot, " +
        "select, [tabindex]:not([tabindex='-1'])";

    const TEXT_INPUT =
        "input:not([type='button']):not([type='submit']):" +
        ":not([type='checkbox']):not([type='radio']):" +
        ":not([type='range']):not([type='file']), " +
        "textarea, [contenteditable='true']";

    let active = false;
    let down = false;
    let mode = "normal";

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    let animationFrame = 0;

    function isMouseEvent(event) {
        return event.pointerType === "mouse";
    }

    function setMode(nextMode) {
        if (!image || mode === nextMode) return;

        mode = nextMode;
        cursor.dataset.mode = nextMode;

        image.src =
            nextMode === "text"
                ? SRC.text
                : SRC.normal;
    }

    function setLinkState(value) {
        if (!cursor) return;

        cursor.classList.toggle(
            "is-link",
            value
        );
    }

    function animate() {
        if (!cursor || !active) {
            animationFrame = 0;
            return;
        }

        const reduceMotion =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        const speed =
            reduceMotion ? 1 : 0.34;

        currentX +=
            (targetX - currentX) * speed;

        currentY +=
            (targetY - currentY) * speed;

        cursor.style.transform =
            `translate3d(${currentX}px, ${currentY}px, 0)`;

        const distance =
            Math.abs(targetX - currentX) +
            Math.abs(targetY - currentY);

        if (distance > 0.1) {
            animationFrame =
                requestAnimationFrame(animate);
        } else {
            animationFrame = 0;
        }
    }

    function startAnimation() {
        if (!animationFrame) {
            animationFrame =
                requestAnimationFrame(animate);
        }
    }

    function enableCursor(x, y) {
        if (!cursor) return;

        if (!active) {
            active = true;

            root.classList.add("cursor-on");

            cursor.hidden = false;

            currentX = x;
            targetX = x;

            currentY = y;
            targetY = y;

            cursor.classList.remove(
                "is-away"
            );
        }
    }

    function disableCursor() {
        if (!cursor) return;

        active = false;
        down = false;

        root.classList.remove(
            "cursor-on"
        );

        cursor.classList.remove(
            "is-down",
            "is-link"
        );

        cursor.classList.add(
            "is-away"
        );

        cursor.hidden = true;

        if (animationFrame) {
            cancelAnimationFrame(
                animationFrame
            );

            animationFrame = 0;
        }
    }

    if (cursor && image) {

        /* Preload cursor images */

        const preloadNormal =
            new Image();

        preloadNormal.src =
            SRC.normal;

        const preloadText =
            new Image();

        preloadText.src =
            SRC.text;


        /*
           MUHIM EVENT:

           pointerType === "mouse" bo'lsa
           custom cursor ishlaydi.

           Bu:
           PC + mouse
           Laptop + mouse
           Planshet + Bluetooth mouse
           Planshet + USB mouse

           holatlarida ishlaydi.
        */

        window.addEventListener(
            "pointermove",
            function (event) {

                if (!isMouseEvent(event)) {
                    return;
                }

                enableCursor(
                    event.clientX,
                    event.clientY
                );

                targetX =
                    event.clientX;

                targetY =
                    event.clientY;

                cursor.classList.remove(
                    "is-away"
                );

                startAnimation();

            },
            {
                passive: true
            }
        );


        /* Hover qilinayotgan element */

        window.addEventListener(
            "pointerover",
            function (event) {

                if (!isMouseEvent(event)) {
                    return;
                }

                if (!active) {
                    return;
                }

                if (
                    !(event.target instanceof Element)
                ) {
                    return;
                }

                const target =
                    event.target;


                /* Text input */

                if (
                    target.closest(TEXT_INPUT)
                ) {

                    setMode("text");

                    setLinkState(false);

                    return;
                }


                /* Oddiy cursor */

                setMode("normal");


                /* Clickable element */

                const clickable =
                    target.closest(
                        CLICKABLE
                    );

                setLinkState(
                    !!clickable &&
                    !clickable.matches(
                        ":disabled"
                    )
                );

            },
            {
                passive: true
            }
        );


        /* Mouse down */

        window.addEventListener(
            "pointerdown",
            function (event) {

                if (
                    !isMouseEvent(event)
                ) {
                    return;
                }

                if (!active) {
                    return;
                }

                down = true;

                cursor.classList.add(
                    "is-down"
                );

            },
            {
                passive: true
            }
        );


        /* Mouse up */

        window.addEventListener(
            "pointerup",
            function (event) {

                if (
                    !isMouseEvent(event)
                ) {
                    return;
                }

                down = false;

                cursor.classList.remove(
                    "is-down"
                );

            },
            {
                passive: true
            }
        );


        /* Pointer cancel */

        window.addEventListener(
            "pointercancel",
            function (event) {

                if (
                    !isMouseEvent(event)
                ) {
                    return;
                }

                down = false;

                cursor.classList.remove(
                    "is-down"
                );

            },
            {
                passive: true
            }
        );


        /* Mouse browser oynasidan chiqsa */

        document.addEventListener(
            "mouseleave",
            function () {

                if (
                    !active ||
                    !cursor
                ) {
                    return;
                }

                cursor.classList.add(
                    "is-away"
                );

            },
            {
                passive: true
            }
        );


        /* Mouse qaytib kirsa */

        document.addEventListener(
            "mouseenter",
            function () {

                if (
                    !active ||
                    !cursor
                ) {
                    return;
                }

                cursor.classList.remove(
                    "is-away"
                );

            },
            {
                passive: true
            }
        );


        /* Boshqa tabga o'tganda */

        document.addEventListener(
            "visibilitychange",
            function () {

                if (document.hidden) {

                    cursor.classList.add(
                        "is-away"
                    );

                } else if (active) {

                    cursor.classList.remove(
                        "is-away"
                    );

                }

            }
        );
    }


    /* ==========================================================
       TOUCH TRAIL
       ========================================================== */

    const canvas =
        document.getElementById(
            "swipe-effect"
        );

    if (
        !canvas ||
        !canvas.getContext
    ) {
        return;
    }

    const ctx =
        canvas.getContext("2d");

    if (!ctx) {
        return;
    }

    const ORANGE =
        "242, 140, 40";

    const WIDTH = 22;

    const LIFE = 460;

    let points = [];

    let touching = false;

    let drawingFrame = 0;

    let dpr = 1;


    function resizeCanvas() {

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        canvas.width =
            Math.round(
                window.innerWidth * dpr
            );

        canvas.height =
            Math.round(
                window.innerHeight * dpr
            );

        canvas.style.width =
            `${window.innerWidth}px`;

        canvas.style.height =
            `${window.innerHeight}px`;

        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );
    }


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas,
        {
            passive: true
        }
    );


    function drawFrame(now) {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );


        if (
            touching &&
            points.length
        ) {

            points[
                points.length - 1
            ].t = now;

        }


        points =
            points.filter(
                function (point) {

                    return (
                        now - point.t <
                        LIFE
                    );

                }
            );


        if (!points.length) {

            drawingFrame = 0;

            return;
        }


        ctx.lineCap = "round";

        ctx.lineJoin = "round";


        for (
            let i = 1;
            i < points.length;
            i++
        ) {

            const a =
                points[i - 1];

            const b =
                points[i];


            if (b.breakLine) {
                continue;
            }


            const age =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (now - b.t) /
                        LIFE
                    )
                );


            const alpha =
                0.78 *
                (1 - age);


            ctx.strokeStyle =
                `rgba(${ORANGE}, ${alpha})`;


            ctx.lineWidth =
                WIDTH *
                (1 - age * 0.35);


            ctx.beginPath();

            ctx.moveTo(
                a.x,
                a.y
            );

            ctx.lineTo(
                b.x,
                b.y
            );

            ctx.stroke();
        }


        const last =
            points[
                points.length - 1
            ];


        /* Finger is touching */

        if (touching) {

            ctx.fillStyle =
                `rgba(${ORANGE}, 0.95)`;

            ctx.beginPath();

            ctx.arc(
                last.x,
                last.y,
                WIDTH / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }

        /* Finger released */

        else {

            const age =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (now - last.t) /
                        LIFE
                    )
                );

            ctx.fillStyle =
                `rgba(${ORANGE}, ${
                    0.9 * (1 - age)
                })`;

            ctx.beginPath();

            ctx.arc(
                last.x,
                last.y,
                (WIDTH / 2) *
                    (1 + age * 0.4),
                0,
                Math.PI * 2
            );

            ctx.fill();
        }


        drawingFrame =
            requestAnimationFrame(
                drawFrame
            );
    }


    function startDrawing() {

        if (!drawingFrame) {

            drawingFrame =
                requestAnimationFrame(
                    drawFrame
                );

        }
    }


    const touchOptions = {
        passive: true
    };


    /* Touch start */

    document.addEventListener(
        "touchstart",
        function (event) {

            if (
                event.touches.length !== 1
            ) {
                return;
            }

            touching = true;

            const touch =
                event.touches[0];


            points.push({
                x: touch.clientX,
                y: touch.clientY,
                t: performance.now(),
                breakLine: true
            });


            startDrawing();

        },
        touchOptions
    );


    /* Touch move */

    document.addEventListener(
        "touchmove",
        function (event) {

            if (!touching) {
                return;
            }

            if (
                event.touches.length !== 1
            ) {
                return;
            }


            const touch =
                event.touches[0];

            const last =
                points[
                    points.length - 1
                ];


            if (
                last &&
                Math.hypot(
                    touch.clientX -
                        last.x,
                    touch.clientY -
                        last.y
                ) < 4
            ) {
                return;
            }


            points.push({
                x: touch.clientX,
                y: touch.clientY,
                t: performance.now(),
                breakLine: false
            });


            startDrawing();

        },
        touchOptions
    );


    function stopTouch() {
        touching = false;
    }


    document.addEventListener(
        "touchend",
        stopTouch,
        touchOptions
    );


    document.addEventListener(
        "touchcancel",
        stopTouch,
        touchOptions
    );

})();