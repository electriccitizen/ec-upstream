(function (Drupal, once) {

  Drupal.behaviors.passwordInput = {
    attach: function (context, settings) {
      once('showPass', '#show-password', context).forEach(password => {

        const passwordInput = document.getElementById('edit-pass');

        password.addEventListener('click', function (e) {
          if (password.classList.contains('show')) {
            password.classList.remove('show');
            password.textContent = 'Show Password';
            passwordInput.type = 'password';
          } else {
            password.classList.add('show');
            password.textContent = 'Hide Password';
            passwordInput.type = 'text';
          }
        });
      });
    }
  };

})(Drupal, once);
