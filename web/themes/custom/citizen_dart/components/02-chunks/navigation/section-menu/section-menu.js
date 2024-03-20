(function($, Drupal, once) {

  Drupal.behaviors.sectionMenu = {
    attach: function (context) {
      once('section-menu', '#block-section-menu', context).forEach(sectionMenu => {
        const sectionMenuWrapper = sectionMenu.querySelector('#section-menu-wrapper');
        //mobile toggle
        sectionMenu.querySelector('.section-menu-toggle').addEventListener('click', event => {
          event.preventDefault();
          if (window.outerWidth < 980) {
            if (event.target.classList.contains('active-nav')) {
              event.target.setAttribute('aria-expanded', false);
              event.target.classList.remove('active-nav');
              event.target.querySelector('.material-icons').innerHTML = 'menu';
              sectionMenuWrapper.setAttribute('aria-hidden', true);
              slideUp(sectionMenuWrapper, 200);
            }
            else {
              event.target.setAttribute('aria-expanded', true);
              event.target.classList.add('active-nav');
              event.target.querySelector('.material-icons').innerHTML = 'close';
              sectionMenuWrapper.setAttribute('aria-hidden', false);
              slideDown(sectionMenuWrapper, 200);
            }
          }
        });

        window.addEventListener('resize', Drupal.debounce(mobileSectionNav, 150, false));

        //need doc ready because active-class script fires after theme scripts
        window.onload = () => {
          $('#section-menu-wrapper ul li').each(function(){
            //find nested lists and set their parents and expanders
            if (($('ul', this).length) && (!$('.expander:first', this).length) ) {
              $(this).addClass('parent').prepend('<a href="#" class="expander" aria-expanded="false" role="button" aria-label="Section Submenu Expander"></a>').find(' > a:not(.expander)').next('ul').attr('aria-hidden', 'true');
            }

            //find active links and set the active trail
            $('.is-active', this).removeAttr('href').siblings('ul').slideDown('fast').attr('aria-hidden', 'false').end().parentsUntil('#section-menu-wrapper > ul').addClass('active-trail expanded');

            //find active-trail li and add aria expanded role to the expander
            $('li.active-trail > .expander').attr('aria-expanded', "true").siblings('ul').attr('aria-hidden', 'false');
          });

          //set button roles, tab indexes and key presses on sidebar links
          $(document).on('click','#section-menu-wrapper .expander',function(e){
            e.preventDefault();
            if ( $(this).attr('aria-expanded') == 'false' ) {
              $(this).attr('aria-expanded', "true").siblings('ul').slideDown('fast').attr('aria-hidden', 'false').end().closest('li').addClass('expanded');
            } else {
              $(this).attr('aria-expanded', "false").siblings('ul').slideUp('fast').attr('aria-hidden', 'true').end().closest('li').removeClass('expanded');
            }
          });
        };
      });
    }
  }//end section menu function

})(jQuery, Drupal, once);

/**
 * Animate an element collapsing a la jQuery's slideUp() method.
 * @param {HTMLElement} element
 * @param {number} duration
 */
function slideUp(element, duration) {
  element.style.overflow = 'hidden';
  window.requestAnimationFrame(timestamp => animateSlide(element, element.scrollHeight, -element.scrollHeight, duration, timestamp));
}

/**
 * Animate an element opening a la jQuery's slideDown() method.
 * @param {HTMLElement} element
 * @param {number} duration
 */
function slideDown(element, duration) {
  element.style.display = 'block';
  window.requestAnimationFrame(timestamp => animateSlide(element, 0, element.scrollHeight, duration, timestamp));
}

/**
 * Over time continue to collapse/open a given element by height.
 * @param {HTMLElement} element
 * @param {number} startHeight
 * @param {number} endHeight
 * @param {number} duration
 * @param {number} timestamp
 * @param {number} startTime
 */
function animateSlide(element, startHeight, endHeight, duration, timestamp, startTime = 0) {
  if (startTime === 0) {
    startTime = timestamp;
  }

  const currentTime = timestamp - startTime;
  let animationContinue = currentTime < duration;
  let newHeight = animateEasing(currentTime, startHeight, endHeight, duration);

  if (animationContinue) {
    element.style.height = `${newHeight.toFixed(2)}px`;
    window.requestAnimationFrame((timestamp) => animateSlide(element, startHeight, endHeight, duration, timestamp, startTime));
  }
  else {
    if (endHeight < 0) {
      element.style.display = 'none';
    }
    element.style.overflow = 'visible';
  }
}

/**
 * Use a linear quadratic formula to calculate the height for an animated slide.
 * @param {number} timepassed
 * @param {number} start
 * @param {number} end
 * @param {number} duration
 * @returns {number}
 */
function animateEasing(timepassed, start, end, duration) {
  const difference = timepassed / duration;
  return -end * difference * (difference - 2) + start;
}

/**
 * Update ARIA roles for mobile menu depending on if we're at mobile size.
 */
function mobileSectionNav() {

  const sectionMenuToggle = document.querySelector(".section-menu-toggle");
  const sectionMenuWrapper = document.querySelector("#section-menu-wrapper");

  if (window.outerWidth < 980) {
    // If ARIA settings not already on the toggle due to the user clicking it,
    // add them.
    if (!sectionMenuToggle.hasAttribute('aria-controls')) {
      sectionMenuToggle.setAttribute('href', '#');
      sectionMenuToggle.setAttribute('aria-controls', 'section-menu-wrapper');
      sectionMenuToggle.setAttribute('aria-expanded', false);
      sectionMenuWrapper.setAttribute('aria-hidden', true);
    }
  }
  else {
    // Strip all ARIA attributes and prevent clicking it.
    sectionMenuToggle.removeAttribute('aria-controls');
    sectionMenuToggle.removeAttribute('aria-expanded');
    sectionMenuToggle.removeAttribute('role');
    sectionMenuToggle.removeAttribute('href');
    sectionMenuWrapper.removeAttribute('aria-hidden');
  }
}
