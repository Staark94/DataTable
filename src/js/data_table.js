let $ = window.jQuery.noConflict();

class DataTableClass {
    constructor(options) {
        if(typeof options === "undefined") {
            options = {};
        }

        let actions = {
            edit: '<i class="show fas fa-edit on-edit row"></i>',
            save: '<i class="hidden hidden fas fa-save on-save row"></i>',
            delete: '<i class="show fas fa-minus-circle on-delete row"></i>',
            cancel: '<i class="hidden fas fa-window-close on-cancel row"></i>',
        };

        options.tableID = options.tableID ?? undefined;

        options.edit = '.on-edit.row';
        options.save = '.on-save.row';
        options.deletes = '.on-delete.row';
        options.cancel = '.on-cancel.row';

        options.onSave = options.onSave ?? false;
        options.table = options.tableID ?? document.querySelector('table');

        // Storage Old Values
        options.oldValues = [] ?? undefined;

        // Storage Post Values
        options.postData = [] ?? undefined;

        if(typeof options.table !== "undefined") {
            $(options.table).find('thead tr th').last().after('<th scope="col">Actions</th>');

            $.each($(options.table).find('tbody tr'), function (e, index) {
                $(index).find('td').attr('on-editable', 'true');
                $(index).eq(0).removeAttr('on-editable', 'true');
                $(index).append('<td class="actions">'+ actions.edit +' '+ actions.delete +' '+ actions.save +' '+ actions.cancel +'</td>');
            });

            // Create an editable form
            $(options.edit, options.table).on('click', function (e) {
                e.preventDefault();
                let parent = this.parentNode.parentNode;
                let editable = $('td', parent);

                if(editable.not('.actions')) {
                    $.each(editable.not('.actions'), function (e, index) {
                        options.oldValues[e] = $(index, e).html();
                        $(index).html('<input type="text" class="form-control" name="'+ e +'" value="'+ $(index).html() +'" />');
                    });
                }

                if(editable.hasClass('actions')) {
                    editable.find('.show').hide();
                    editable.find('.hidden').show();
                }
            });

            // Unset the changes
            $(options.cancel, options.table).on('click', function (e) {
                e.preventDefault();
                let parent = this.parentNode.parentNode;
                let editable = $('td', parent);

                console.log(options.oldValues);

                if(editable.not('.actions')) {
                    $.each(options.oldValues, function (key, value) {
                        console.log(key + value);
                        editable.not('.actions').eq(key).html(value);
                    });
                }

                if(editable.hasClass('actions')) {
                    editable.find('.show').show();
                    editable.find('.hidden').hide();
                }
            });

            // Save the changes on table
            $(options.save, options.table).on('click', function (e) {
                e.preventDefault();
                let parent = this.parentNode.parentNode;
                let editable = $('td', parent);

                if(editable.not('.actions')) {
                    $.each(editable.not('.actions'), function (key, value) {
                        let newValues = $(value, key).find('input').val();
                        options.postData[key] = $(value, key).find('input').val();

                        $(value, key).html(newValues);
                    });
                }

                if(editable.hasClass('actions')) {
                    editable.find('.show').show();
                    editable.find('.hidden').hide();
                }
            });

            // Delete an row from table
            $(options.deletes, options.table).on('click', function (e) {
                e.preventDefault();
                let parent = this.parentNode.parentNode;
                parent.remove();
            });
        }

        console.log(options);
    }

    saveAsync(params) {
        if(typeof params === "undefined") {
            console.log("No params has defined");
            return false;
        }

        params.type = "POST" ?? params.type;
        params.dataPost = params.dataPost ?? {};
        params.dataPost.save = true;

        $.ajax({
            url: params.url,
            type: params.type,
            dataType: 'json',
            data: params.dataPost
        }).done(function (XMLHttpRequest, textStatus) {
            console.log(XMLHttpRequest);
            console.log('save with ajax' + textStatus);
        }).fail(function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        });
    }
}