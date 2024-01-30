(function($, Drupal, once) {

/* LAYOUT TABS
------------------------------------ */
Drupal.behaviors.layoutTabs = {
	attach: function (context, settings) {
		$(once('isTabs', '.layout__region--tabs:not(.layout-builder__region)', context)).each(function(){

      document.querySelector('.tabs-instructions').remove();

      const tabContainer = this;
			const tabItems = Array.from(tabContainer.children);

			if (tabItems.length > 1) {
		    const tabsWrapper = document.createElement('div');
		    tabsWrapper.classList.add('tabs-wrapper');
		    tabContainer.insertBefore(tabsWrapper, tabContainer.firstChild);

		    const tabsHeader = document.createElement('ul');
		    tabsHeader.classList.add('tabs-header');
		    tabsWrapper.appendChild(tabsHeader);

		    let firstTabItem;
		    
		    tabItems.forEach(function(tabItem, index) {
	        const tabTitle = tabItem.querySelector('.block-title').textContent;
	        const tabId = `tab${Math.floor((Math.random() * 100) + 1)}`;
	        const tabControl = `<li><a href="#" class="tab-control" aria-expanded="false" aria-controls="${tabId}">${tabTitle}</a></li>`;
	        tabsHeader.innerHTML += tabControl;

	        const newTabItem = document.createElement('div');
	        newTabItem.id = tabId;
	        newTabItem.classList.add('tab-item');
	        newTabItem.setAttribute('aria-hidden', 'true');
	        tabsWrapper.appendChild(newTabItem);
	        newTabItem.appendChild(tabItem);

	        // Track the first tab item
	        if (index === 0) {
            firstTabItem = newTabItem;
	        }
		    });

		    // Initialize the first tab
		    if (firstTabItem) {
	        firstTabItem.setAttribute('aria-hidden', 'false');
	        firstTabItem.classList.add('open-tab');

	        const firstTabControl = tabsWrapper.querySelector('.tab-control:first-child');
	        if (firstTabControl) {
            firstTabControl.setAttribute('aria-expanded', 'true');
            firstTabControl.classList.add('active-tab');
	        }
		    }
			}

      const tabControls = document.querySelectorAll('.tab-control');

			function tabControlClickHandler(e) {
		    e.preventDefault();
		    if (!this.classList.contains('active-tab')) {
	        const tabTrigger = this.getAttribute('aria-controls');
	        const activeTab = document.querySelector('.active-tab');
	        if (activeTab) {
            activeTab.classList.remove('active-tab');
            activeTab.setAttribute('aria-expanded', 'false');
            const openTab = document.querySelector('.open-tab');
            if (openTab) {
              openTab.classList.remove('open-tab');
              openTab.setAttribute('aria-hidden', 'true');
              openTab.style.display = 'none';
            }
	        }
	        this.classList.add('active-tab');
	        this.setAttribute('aria-expanded', 'true');
	        const selectedTab = document.querySelector('.tab-item#' + tabTrigger);
	        if (selectedTab) {
            selectedTab.classList.add('open-tab');
            selectedTab.setAttribute('aria-hidden', 'false');
            selectedTab.style.display = 'block';
	        }
		    }// end if no active tab
			}//end tab control click handler

			tabControls.forEach(function(tabControl) {
			  tabControl.addEventListener('click', tabControlClickHandler);
			});

		});
	}
};

})(jQuery, Drupal, once);
