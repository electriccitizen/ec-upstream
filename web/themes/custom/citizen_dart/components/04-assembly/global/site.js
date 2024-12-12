(function ($, Drupal, once) {

  /* BACK TO TOP
  ------------------ */
  Drupal.behaviors.backToTop = {
    attach: function (context, settings) {
      once('backTop', 'html.js', context).forEach(backTop => {
        window.addEventListener('scroll', function () {
          var back = window.innerHeight * 0.8;
          if (window.scrollY > back) {
            document.querySelector('.back-anchor').style.display = 'block';
          } else {
            document.querySelector('.back-anchor').style.display = 'none';
          }
        });
        document.querySelector('.back-anchor a').addEventListener('click', function (e) {
          e.preventDefault();
          window.scrollTo({
            top: document.body.offsetTop - 10,
            behavior: 'smooth'
          });
        });
      });
    }
  }
  Drupal.behaviors.widthCheck = {
    attach: function (context, settings) {
      once('desktopSizing', 'body', context).forEach(() => {
        // Get desktop width from CSS vars set in 00-base/variables/_units.scss.
        let deskWidth = window.getComputedStyle(document.documentElement).getPropertyValue('--desk-size');
        if (!deskWidth) {
          // As a backup, just in case the browser doesn't support CSS vars.
          deskWidth = "984px";
        }
        deskWidth = deskWidth.replace("px", "");
        let currentSize = "";
        widthCheck();

        window.addEventListener('resize', widthCheck);

        function widthCheck() {
          const oldSize = currentSize;
          if ($(window).width() >= deskWidth) {
            currentSize = "desk";
          }
          else {
            currentSize = "mobile";
          }
          if (oldSize !== currentSize) {
            $("body").removeClass("size-" + oldSize);
            $("body").addClass("size-" + currentSize);
          }
        }
      });
    }
  }

  // move gtranslate
  Drupal.behaviors.gtranslateBlock = {
    attach: function (context, settings) {
    	$(once('moveGtranslateBlock', '.block-gtranslate-block', context)).each(function(){

        //create list item, append to menu, append GTranslate block to list item
        $('.block-gtranslate-block .gt_selected a').text('Translate').prepend('<span class="material-icons-outlined">language</span>');;

        //update text of menu items
        let options = $('.block-gtranslate-block .gt_option a');
        for (let i = 0; i < options.length; i++) {
          if ($(options[i]).text() == ' Chinese (Simplified)') {
            $(options[i]).text('中文（简体)');
          } else if ($(options[i]).text() == ' Chinese (Traditional)') {
            $(options[i]).text('中文（普通話)');
          } else if ($(options[i]).text() == ' Khmer') {
            $(options[i]).text('ភាសាខ្មែរ');
          } else if ($(options[i]).text() == ' Somali') {
            $(options[i]).text('Soomaali');
          } else if ($(options[i]).text() == ' Spanish') {
            $(options[i]).text('Español');
          } else if ($(options[i]).text() == ' Vietnamese') {
            $(options[i]).text('Tiếng Việt');
          }
        }

        //add disclaimer popup after translating to non-English page
        let alertEnglish = 'Hello! This page has been translated by a computer. This sometimes results in poor-quality translations. We are sorry for any problems this may cause. To get help from a person who speaks your language, please contact us at equity@Bloomingtonmn.gov or 952-563-8739.';
        let alertChineseSimp = '您好！ 本页面已由计算机翻译。 这有时会存在翻译质量不佳。 对于可能由此导致的任何问题，我们深表歉意。 如需与您说同种语言的人提供帮助，请通过 Equity@Bloomingtonmn.gov 或 952-563-8739 联系我们';
        let alertChineseTrad = '您好！ 此頁面已由電腦翻譯。 這有時會導致翻譯品質不佳。 對於由此可能導致的任何問題，我們深表歉意。 欲從說您語言的人員來獲得幫助，請透過equity@Bloomingtonmn.gov 或952-563-8739 與我們聯繫';
        let alertKhmer = 'សួស្តី! ទំព័រនេះត្រូវបានបកប្រែដោយកុំព្យូទ័រ។ ពេលខ្លះលទ្ធផលនៃការបកប្រែមានគុណភាពអន់។ យើងខ្ញុំសូមអភ័យទោសចំពោះបញ្ហាណាមួយដែលរឿងនេះអាចបង្កឱ្យមាន។ ដើម្បីទទួលជំនួយពីមនុស្សម្នាក់ដែលនិយាយភាសារបស់អ្នក សូមទាក់ទងមកយើងខ្ញុំតាមអ៊ីមែល equity@Bloomingtonmn.gov ឬតាមលេខទូរសព្ទ 952-563-8739។';
        let alertSomali = 'Nabad! Boggan waxa tarjumay kombuyuutar. Tani waxay mararka qaar keentaa tarjumaado tayo xun. Waan ka xunnahay wixii dhibaato ay taasi keento. Si aad caawimo uga hesho qof ku hadla luqadaada, fadlan nagala soo xiriir equity@Bloomingtonmn.gov ama 952-563-8739.';
        let alertSpanish = '¡Hola! Una computadora tradujo esta página. A menudo, esto resulta en traducciones de poca o baja calidad. Sentimos mucho cualquier problema que le ocasione. Para recibir ayuda de una persona que hable su idioma, por favor comuníquese con nosotros al equity@Bloomingtonmn.gov o al 952-563-8739.';
        let alertVietnamese = 'Xin chào! Trang này được dịch bởi máy tính. Do đó đôi lúc bản dịch có chất lượng chưa tốt. Chúng tôi xin lỗi nếu việc này gây bất tiện cho bạn. Để được trợ giúp bởi nhân viên biết nói ngôn ngữ của bạn, vui lòng liên hệ với chúng tôi theo địa chỉ equity@Bloomingtonmn.gov hoặc gọi số 952-563-8739.';
        let alerts = [
          alertEnglish, alertChineseSimp, alertChineseTrad, alertSpanish, alertVietnamese, alertKhmer, alertSomali
        ];
        for (let i = 0; i < $(options).length; i++){
          $(options[i]).click(function(){
            i != 0 ? alert(alerts[i]) : '';
            $('.block-gtranslate-block .gt_selected a').text('Translate').prepend('<span class="material-icons-outlined">language</span>');
          });
        }
      });
    }
  }

})(jQuery, Drupal, once);
