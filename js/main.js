//** VARIABLES GLOBALES


//** DOM READY
document.addEventListener("DOMContentLoaded", function() {
    console.log('ready');

    // Scroll horizontal on main page
    if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
        const scrollX = document.querySelector("main");

        if (scrollX) {
            scrollX.addEventListener("wheel", (evt) => {
                evt.preventDefault();
                scrollX.scrollLeft += evt.deltaY;
            }, { passive: false });
        }
    }

    // * RAIN
    // Detect if device has touch capability
    const isTouchDevice = () => {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    };

    if (!isTouchDevice()) { // Mouse Device
        //* Rain Follow Cursor
        const rainLines = document.querySelectorAll('.rain-line');
        initRainFollowCursor(rainLines);

            rainLines.forEach((line) => {
            line.addEventListener('click', () => {
                window.location.href = 'project.html';
            });
        });
    }
    else{ //* Touch Device
        
        const rainLines = document.querySelectorAll('.rain-line');
        let selectedLine = null;

        rainLines.forEach((line) => {
            line.addEventListener('click', (e) => {
                // If this line is already selected, navigate to link
                if (selectedLine === line) {
                    window.location.href = line.getAttribute('href') || 'project.html';
                } else {
                    // Hide all other lines' text, show this one's text
                    rainLines.forEach((otherLine) => {
                        otherLine.classList.remove('active');
                    });
                    line.classList.add('active');
                    selectedLine = line;
                    
                    // Click outside to deselect
                    rainLines.forEach((line) => {
                            line.classList.remove('active');
                    });
                }
            });
        });

        //* Mobile Menu in Touch Device
        const menuIcon = document.querySelector(".mobile-menu-icon");
        const openIcon = document.querySelector('.icon-open');
        const closeIcon = document.querySelector('.icon-close');
        const menu = document.querySelector(".mobile-menu");

        menuIcon.addEventListener('click', () => {
            const isOpen = menu.classList.toggle("is-open");
            openIcon.classList.toggle("icon-hide", isOpen);
            closeIcon.classList.toggle("icon-hide", !isOpen);
        });
    }

    //* Scroll to top button
    const scrollContainer = document.querySelector("main");
    const homeButton = document.querySelector('#go-up');
    // Add a click event listener to the button
    if (homeButton){
        homeButton.addEventListener('click', () => {
            // Scroll to the top of the page
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    
    //* Image Zoom
    zoomImage();

    //* On Scroll Animations
    var scrollElements = document.querySelectorAll(".on-scroll");
    
    $(window).on('scroll', function() {
        scrollElements.forEach(scrollElement => {
            if (checkVisible($(scrollElement))) {
                scrollElement.classList.add("show");
                scrollElement.classList.remove("hide");
            } else {
                // scrollElement.classList.remove("show");
                // scrollElement.classList.add("hide");
            }
        });
    });
    // Trigger the scroll event initially to check visibility on page load
    $(window).trigger('scroll');

});

//** FUNCTIONS EXTERNES

//* Rain Follow Cursor Functionality
function initRainFollowCursor(rainLines) {
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;

        // Get center of screen
        const centerX = window.innerWidth / 2;

        // Calculate angle based on horizontal cursor position only
        const horizontalPos = (mouseX - centerX) / (window.innerWidth / 2); // -1 to 1
        let angle = -(horizontalPos * 45); // Rotate between -135deg to -45deg

        // Apply same rotation to all rain lines
        rainLines.forEach((line) => {
            line.style.rotate = angle + 'deg';
        });
    });
}

//* Image Zoom Functionality
function zoomImage() {
    var actual_img = 0;
    var all_src = [];
    var rapport_img = [];
    var rapport_ecran = ($(window).width() - 160) / ($(window).height() - 40);
    
    $(window).resize(function(){
        rapport_ecran = ($(window).width() - 160) / ($(window).height() - 40);
    });
    
    // Get all project images
    var img_all = document.querySelectorAll('.project-img');
    img_all.forEach(function(item, a){
        all_src.push($(item).attr("src"));
        rapport_img.push(item.clientWidth / item.clientHeight);
    });

    console.log("Images found:", all_src.length);
    console.log(rapport_img);
    
    // Click handler for images to open zoom
    $(".project-img").click(function(){
        actual_img = $(".project-img").index(this);
        $(".zoom-img").html("<img src='" + all_src[actual_img] + "'>");
        $(".zoom").fadeIn(500).css("display", "flex");
        
        if (rapport_ecran > rapport_img[actual_img] ){
            $(".zoom-img").find("img").css("width","auto").css("height","100%");
        }else{
            $(".zoom-img").find("img").css("width","100%").css("height","auto");
        }
    });
    
    // Close zoom
    $(".zoom-exit").click(function(){
        $(".zoom").fadeOut(500);
    });
    
    // Left arrow
    $(".zoom-arrow-left").click(function(){
        actual_img -= 1;
        if (actual_img < 0){ actual_img = all_src.length - 1; }
        $(".zoom-img").html("<img src='" + all_src[actual_img] + "'>");
        
        if (rapport_ecran > rapport_img[actual_img] ){
            $(".zoom-img").find("img").css("width","auto").css("height","100%");
        }else{
            $(".zoom-img").find("img").css("width","100%").css("height","auto");
        }
    });
    
    // Right arrow
    $(".zoom-arrow-right").click(function(){
        actual_img += 1;
        actual_img = actual_img % all_src.length;
        $(".zoom-img").html("<img src='" + all_src[actual_img] + "'>");
        
        if (rapport_ecran > rapport_img[actual_img] ){
            $(".zoom-img").find("img").css("width","auto").css("height","100%");
        }else{
            $(".zoom-img").find("img").css("width","100%").css("height","auto");
        }
    });
}

// Check if element is visible in viewport
function checkVisible(elm, mode) {
    mode = mode || "object visible";
    var viewportHeight = $(window).height(), // Viewport Height
        scrolltop = $(window).scrollTop(), // Scroll Top
        y = $(elm).offset().top + 200,
        elementHeight = $(elm).height();   

    if (mode == "object visible") return ((y < (viewportHeight + scrolltop)) && (y > (scrolltop - elementHeight)));
    if (mode == "above") return ((y < (viewportHeight + scrolltop)));
}