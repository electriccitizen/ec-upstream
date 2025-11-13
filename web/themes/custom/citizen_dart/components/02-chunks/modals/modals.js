(function(Drupal, once) {

	//Pop-up content functionality.
	Drupal.behaviors.modal = {
    attach: function (context) {
      once('modalContent', '.modal', context).forEach(modal => {
				//set the variables needed to keep the modal controls specific
				const modalLead = modal.querySelector('.modal-lead');
				const modalWrapper = modal.querySelector('.modal-wrapper');
				const overflowGuard = document.querySelector('.overflow-guard');

				if (modalWrapper && overflowGuard) {
				  overflowGuard.appendChild(modalWrapper);
				}

				window.addEventListener('load', () => {
          // Cache key elements relative to the current modal so we do not rely on matching IDs.
          const button = modalLead ? modalLead.querySelector('.ec-modal-trigger') : null;
          const modalRoot = modalWrapper;
          const modalInner = modalWrapper ? modalWrapper.querySelector('.modal-inner') : null;
          const close = modalWrapper ? modalWrapper.querySelector('.modal-close') : null;

          if (!button || !modalRoot || !modalInner || !close) {
            return;
          }
          //set the click functions
          modalRoot.addEventListener('click', rootClick);
          button.addEventListener('click', openModal);
          modalInner.addEventListener('click', modalClick);
          close.addEventListener('click', modalClose);
          //close when the modal window is clicked out side of the content
          function rootClick() {
            modalRoot.classList.add('close-modal');
            setTimeout(() => { modalRoot.classList.remove('close-modal','active-modal'); }, 1200);
          }
          //close when the close button is clicked
          function modalClose() {
            modalRoot.classList.add('close-modal');
            setTimeout(() => { modalRoot.classList.remove('close-modal','active-modal'); }, 1200);

            //if there is a external video in an iframe or an HTML video, stop it when the modal closes
            if (modalInner.getElementsByTagName('iframe').length != 0) {
              modalInner.getElementsByTagName('iframe')[0].src = modalInner.getElementsByTagName('iframe')[0].src;
            }
            else if (modalInner.getElementsByTagName('video').length != 0) {
              modalInner.getElementsByTagName('video')[0].pause();
              modalInner.getElementsByTagName('video')[0].currentTime = 0;
            }
          }

          function openModal() {
            modalRoot.classList.add('active-modal');
            if (modalInner.getElementsByTagName('form').length != 0) {
              modalInner.getElementsByTagName('form')[0].getElementsByTagName('input')[0].focus();
            }
            else {
              modalInner.focus();
            }
          }
          // Prevent close when the modal inner content is clicked.
          function modalClick(e) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
          }
          // Close the modal when the ESC key is pressed.
          document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' || event.keyCode === 27) {
              modalClose();
            }
          });
        });

      });
		}
	}

	})(Drupal, once);
