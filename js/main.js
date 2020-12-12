// CSS Powered Content Scroll
const contentScroll = () => {
    new ScrollBooster({
        viewport: document.querySelector(".viewport"),
        content: document.querySelector(".content"),
        scrollMode: "native"
    });
};

// Native Content Scroll
// const setupExample2 = () => {
//     new ScrollBooster({
//         viewport: document.querySelector(".example2 .viewport"),
//         content: document.querySelector(".example2 .content"),
//         scrollMode: "native"
//     });
// };

function initContentScroll() {
    contentScroll();
    // setupExample2();
}

if (document.readyState !== "loading") {
    initContentScroll();
} else {
    document.addEventListener("DOMContentLoaded", initContentScroll);
}
