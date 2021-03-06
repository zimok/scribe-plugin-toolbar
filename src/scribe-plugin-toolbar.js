define(function () {

  'use strict';

  return function (toolbarNode) {
    return function (scribe) {
      var buttons = toolbarNode.querySelectorAll('button[data-command-name]');

      Array.prototype.forEach.call(buttons, function (button) {
        // Look for a predefined command, otherwise define one now.
        var command = scribe.getCommand(button.dataset.commandName);

        button.addEventListener('click', function () {
          /**
           * Focus will have been taken away from the Scribe instance when
           * clicking on a button (Chrome will return the focus automatically
           * but only if the selection is not collapsed. As per: http://jsbin.com/tupaj/1/edit?html,js,output).
           * It is important that we focus the instance again before executing
           * the command, because it might rely on selection data.
           */
          scribe.el.focus();
          command.execute();
          /**
           * Chrome has a bit of magic to re-focus the `contenteditable` when a
           * command is executed.
           * As per: http://jsbin.com/papi/1/edit?html,js,output
           */
        });

        // Keep the state of toolbar buttons in sync with the current selection.
        // Unfortunately, there is no `selectionchange` event.
        scribe.el.addEventListener('keyup', updateUi);
        scribe.el.addEventListener('mouseup', updateUi);

        scribe.el.addEventListener('focus', updateUi);
        scribe.el.addEventListener('blur', updateUi);

        // We also want to update the UI whenever the content changes. This
        // could be when one of the toolbar buttons is actioned.
        scribe.on('content-changed', updateUi);

        function updateUi() {
          var selection = new scribe.api.Selection();

          if (selection.range && command.queryEnabled()) {
            button.removeAttribute('disabled');

            if (command.queryState()) {
              button.classList.add('active');
            } else {
              button.classList.remove('active');
            }
          } else {
            button.setAttribute('disabled', 'disabled');
          }
        }
      });
    };
  };

});
