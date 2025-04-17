const apiEndpoint = "https://3ttgjnibkj.execute-api.us-east-1.amazonaws.com/DEV";

$(document).ready(function () {
	// Fetch makes once on page load
	// Make selection
	fetch(apiEndpoint + "/makes")
	.then(res => res.json())
	.then(makes => {
		const options = makes.map(m => ({ id: m, text: m }));
		$('#make').select2({
			placeholder: 'Select Make',
			data: options,
			dropdownAutoWidth: true,
			closeOnSelect: true,
			allowClear: true,
			minimumInputLength: 0
		});
	});

	// Focus search on open
	$('#make').on('select2:open', function () {
		// Give focus to the internal search field
		document.querySelector('.select2-container--open .select2-search__field').focus();
	});

	// Close select behaviour for unfocusing
	$(document).on('click', function (e) {
		if (!$(e.target).closest('.select2-container').length) {
			$('#make').select2('close');
		}
	});

	// Listen for when a make is selected
	$('#make').on('change', function () {
		const selectedMake = $(this).val();  // Get the selected make

		// If no make is selected, clear and disable the model dropdown
		if (!selectedMake) {
			$('#model').val(null).trigger('change').prop('disabled', true);
			return;
		}

		// Enable the model select
		$('#model').prop('disabled', false);

		// Fetch models for the selected make
		fetch(`${apiEndpoint}/models?make=${encodeURIComponent(selectedMake)}`)
		.then(res => res.json())
		.then(models => {
			const options = models.map(m => ({ id: m, text: m }));
			options.unshift({ id: '', text: '' });

			$('#model').empty().select2({
				placeholder: 'Select Model',
				data: options,
				dropdownAutoWidth: true,
				closeOnSelect: true,
				allowClear: true,
				minimumInputLength: 0
			}).val(null);
		})
		.catch(error => {
			console.error('Error fetching models:', error);
		});
	});

	// Focus search on open
	$('#model').on('select2:open', function () {
		document.querySelector('.select2-container--open .select2-search__field').focus();
	});

	// Close select behaviour for unfocusing
	$(document).on('click', function (e) {
		if (!$(e.target).closest('.select2-container').length) {
			$('#model').select2('close');
		}
	});

	// On form submit
	$('#car-form').on('submit', function (e) {
		e.preventDefault();

		const payload = {
			make: $('#make').val(),
			model: $('#model').val(),
			year: $('#year').val(),
			mileage: $('#mileage').val()
		};

		$('#response-box').hide();

		fetch(apiEndpoint + "/predict", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		})
		.then(res => res.json().then(data => ({ status: res.status, body: data })))
		.then(({ status, body }) => {
			const box = $('#response-box');
			box.removeClass('alert-success alert-danger');

			if (status === 200) {
				box.addClass('alert-success');
				box.text(body.body);
			} else {
				box.addClass('alert-danger');
				box.text(body.error || "Something went wrong.");
			}

			box.fadeIn();
		})
		.catch(err => {
			$('#response-box').removeClass().addClass('alert alert-danger').text("Request failed.").fadeIn();
		});
	});
});