(function($) {
  'use strict';
  $(function() {
    if ($('.demo-tabs').length) {
      $('.demo-tabs').pwstabs({
        effect: 'none'
      });
    }

    if ($('.hello_world').length) {
      $('.hello_world').pwstabs();
    }

    if ($('#rtl-tabs-1').length) {
      $('#rtl-tabs-1').pwstabs({
        effect: 'slidedown',
        defaultTab: 2,
        rtl: true
      });
    }

    if ($('#vertical-left').length) {
      $('#vertical-left').pwstabs({
        effect: 'slideleft',
        defaultTab: 1,
        containerWidth: '600px',
        tabsPosition: 'vertical',
        verticalPosition: 'left'
      });
    }

    if ($('#horizontal-left').length) {
      $('#horizontal-left').pwstabs({
        effect: 'slidedown',
        defaultTab: 2,
        containerWidth: '600px',
        horizontalPosition: 'bottom'
      });
    }

    if ($('.tickets-tab').length) {
      $('.tickets-tab').pwstabs({
        effect: 'none'
      });
    }

  });


  showSwal = function(type) {
    'use strict';
    if (type === 'basic') {
      swal({
        text: 'Any fool can use a computer',
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })

    } else if (type === 'title-and-text') {
      swal({
        title: 'Read the alert!',
        text: 'Click OK to close this alert',
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })

    } else if (type === 'success-message') {
      swal({
        title: 'Congratulations!',
        text: 'You entered the correct answer',
        icon: 'success',
        button: {
          text: "Continue",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })

    } else if (type === 'auto-close') {
      swal({
        title: 'Auto close alert!',
        text: 'I will close in 2 seconds.',
        timer: 2000,
        button: false
      }).then(
          function() {},
          // handling the promise rejection
          function(dismiss) {
            if (dismiss === 'timer') {
              console.log('I was closed by the timer')
            }
          }
      )
    } else if (type === 'warning-message-and-cancel') {
      swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3f51b5',
        cancelButtonColor: '#ff4081',
        confirmButtonText: 'Great ',
        buttons: {
          cancel: {
            text: "Cancel",
            value: null,
            visible: true,
            className: "btn btn-danger",
            closeModal: true,
          },
          confirm: {
            text: "OK",
            value: true,
            visible: true,
            className: "btn btn-primary",
            closeModal: true
          }
        }
      })

    } else if (type === 'custom-html') {
      swal({
        content: {
          element: "input",
          attributes: {
            placeholder: "Type your password",
            type: "password",
            class: 'form-control'
          },
        },
        button: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary"
        }
      })
    }
  }

  console.log(showSwal);

})(jQuery);