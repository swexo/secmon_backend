var newFilterTemplate = $('.rule').eq(0).clone();

function OnFilterTypeChanged(element) {
	var select = $(element);
	var index = select.attr('data-rule-type');
	var newType = select.val();
	var rule = $('#rules').find('*[data-rule=\''+ index +'\']');
	if (rule.length > 0) {
		rule.find('*[data-type]').each(function(i, e){
			var root = $(e);
			var type = root.attr('data-type');

			if (type != 'global') {
                // show/hide root element
                if (type == newType) {
                    root.removeClass('hide');
                }
                else {
                    root.addClass('hide');
                }

				// enable/disable and update selects
				root.find('select').each(function(i, e) {
					var sel = $(e);
					if (type == newType){
						sel.removeAttr('disabled');
					}
					else {
						sel.attr('disabled', 'disabled');
					}

					sel.material_select('destroy');
					sel.material_select();
				});

				// enable/disable inputs
				root.find('input').each(function(i, e) {
					var input = $(e);
					if (type == newType) {
						input.removeAttr('disabled');
					}
					else{
						input.attr('disabled', 'disalbed');
					}
				});
            }
		});
	}
	else
		console.log('Failed to find rule element');
}

function OnColumnChanged(element) {
	var select = $(element);
	var index = select.attr('data-rule-column');
	var types = select.find(':selected').attr('data-types').split(',');
	var typeSelect = $('select[data-rule-type="' + index + '"]');
	var selected = false;

	// enable and disable types allowed for the column
	typeSelect.find('option').each(function(i, e) {
		var option = $(e);
		var val = option.val();
		if (types.indexOf(val) != -1) {
            option.removeAttr('disabled');
            if (selected === false) {
            	selected = true;
            	typeSelect.val(val);
            	OnFilterTypeChanged(typeSelect);
			}
		}
		else {
            option.attr('disabled', 'disabled');
		}

		// reinitialize types select
		typeSelect.material_select('destroy');
		typeSelect.material_select();
    });
}

function removeRule(element) {
	var el = $(element);
	var ruleId = el.attr('data-rule-remove');
	var index = el.attr('data-rule-index');
	var filterId = el.attr('data-filter-id');
	var rule = $('*[data-rule=\''+ index +'\']');
	if (rule.length > 0) {
		rule.remove();
		var index = 0;
		$('#rules').find('.rule').each(function(i, e) {
			changeRuleIndex(e, index++, -1);
		});
	}
	else
		console.log('Failed to found rule ' + index);
}

function changeRuleIndex(ruleElement, newIndex, removeId) {
	var element = $(ruleElement);
	var oldIndex = element.attr('data-rule');
	var logic = element.find('#logic');
	var logicSelect = logic.find('[data-value-type="filter_rule_logic_operator"]');
	if (newIndex == 0) {
		logic.addClass('hide');
		logicSelect.attr('disabled', 'disabled');
	}
	else {
		logic.removeClass('hide');
		logicSelect.removeAttr('disabled');
	}

	element.attr('data-rule', newIndex);
	element.find('input, select').each(function(i, e) {
		var el = $(e);
		el.prop('name', el.prop('name').replace('['+ oldIndex+']', '[' + newIndex + ']'));
		el.prop('id', el.prop('id').replace('-'+ oldIndex +'-', '-' + newIndex + '-'));
	});
	element.find('a[data-rule-remove]').attr('data-rule-remove', removeId).attr('data-rule-index', newIndex);
    element.find('select[data-rule-type]').each(function(i, e) {
        $(e).attr('data-rule-type', newIndex);
    });
    element.find('select[data-rule-column]').each(function(i, e) {
        $(e).attr('data-rule-column', newIndex);
    });
}

$(document).ready(function () {
	$('#new-rule').click(function() {
		var rules = $('.rule');
		var nr = rules.length;
		var newElement = newFilterTemplate.clone();

		var newRuleLogic = newElement.find('#logic');
		newRuleLogic.removeClass('hide');
		var newRuleId = newElement.find('[data-value-type="filter_rule_id"]');
		newRuleId.attr('disabled', 'disabled');

		changeRuleIndex(newElement, nr, -1);

		newElement.find('input[type=text]').val('');

		$('#rules').append(newElement);

		newElement.find('select').each(function(i, e) {
			var sel = $(e);
			sel.material_select('destroy');
			sel.material_select();
		});

        newElement.find('select[data-rule-type]').each(function(i, e) {
            $(e).on('change', function() { OnFilterTypeChanged(e); });
            OnFilterTypeChanged(e);
        });

        newElement.find('select[data-rule-column]').each(function(i, e) {
            $(e).on('change', function() { OnColumnChanged(e); });
            OnColumnChanged(e);
        });

		activateDatePicker(newElement);
	});

	$("#rules").find('select[data-rule-type]').each(function(i, e) {
		$(e).on("change", function() { OnFilterTypeChanged(e); });
		OnFilterTypeChanged(e);
	});

	$("#rules").find('select[data-rule-column]').each(function(i, e) {
		$(e).on('change', function() { OnColumnChanged(e); });
		OnColumnChanged(e);
	});
});