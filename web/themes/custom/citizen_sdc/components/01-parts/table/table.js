((Drupal, once) => {
  Drupal.behaviors.responsiveTable = {
    attach(context) {
      once('responsive-table', '.layout-container table:not(.ui-datepicker-calendar)', context).forEach((table) => {
        const headers = Array.from(table.querySelectorAll('thead th')).map((th) => th.textContent.trim());

        if (headers.length === 0) {
          table.classList.add('no-header');
          return;
        }

        table.querySelectorAll('tbody tr').forEach((row) => {
          row.querySelectorAll('td').forEach((cell, index) => {
            if (headers[index]) {
              cell.setAttribute('data-th', headers[index]);
            }
          });
        });
      });
    },
  };
})(Drupal, once);
