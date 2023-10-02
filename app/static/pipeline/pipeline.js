const unreceivedFilter = document.querySelector('input.unreceived');
const toggleOngoingFilter = document.querySelector('input.toggle-ongoing');
const showOnlyOngoingFilter = document.querySelector('input.only-ongoing');

const revenueUnitToggle = document.querySelector('#revenue-unit');
const totalExpectedRevenueDisplay = document.querySelector('#total-revenue-monthly-exp');
const currentExpectedRevenueDisplay = document.querySelector(
  '.revenue-display-text.expected'
);
const currentActualRevenueDisplayText = document.querySelector(
  '.revenue-display-text.actual'
);
let totalExpectedRevenueAmt = 0;
let pipelineViewState = 'monthly';

const jobStatusOrderMap = {
  ONGOING: '0_',
  READYTOINV: '1_',
  INVOICED1: '3_',
  INVOICED2: '4_',
  FINISHED: '5_',
  ARCHIVED: '6_',
};

revenueUnitToggle.addEventListener('click', (e) => {
  const btn = e.currentTarget;
  const unitToggleInput = document.querySelector('#id_granular_revenue');
  const revenueInput = document.querySelector('#id_revenue');

  if (btn.classList.contains('active')) {
    btn.textContent = '円';
    unitToggleInput.value = true;
    revenueInput.setAttribute('placeholder', '例）420069');
  } else {
    btn.textContent = '万円';
    unitToggleInput.value = false;
    revenueInput.setAttribute('placeholder', '例）100');
  }
});

function setExpectedRevenueDisplayText() {
  currentExpectedRevenueDisplay.textContent =
    pipelineViewState !== 'monthly' || unreceivedFilter.checked
      ? '表示の案件　請求総額 (予定)'
      : '表示の月　請求総額 (予定)';
}

$(document).ready(function () {
  let date = new Date();
  let currentMonth = date.getMonth() + 1;
  let currentYear = date.getFullYear();
  let viewingMonth = currentMonth;
  let viewingYear = currentYear;
  // flag to control behavior of the Invoice Info and New Client modal interation on the main Pipeline page
  let openInvoiceInfoModal = false;
  let currentRowID;
  let depositDateModal;

  DataTable.ext.order['dom-job-select'] = function (settings, col) {
    return this.api()
      .column(col, { order: 'index' })
      .nodes()
      .map(function (td, i) {
        let status = td.querySelector('.job-status-select').value;
        return status ? jobStatusOrderMap[status] : 0;
      });
  };

  DataTable.ext.search.push(function (settings, data, dataIndex) {
    if (unreceivedFilter.checked) {
      return toggleOngoingFilter.checked
        ? data[10] === '---' || ['ONGOING', 'READYTOINV'].includes(data[9])
        : data[10] === '---' && !['ONGOING', 'READYTOINV'].includes(data[9]);
    }
    if (showOnlyOngoingFilter.checked) return ['ONGOING', 'READYTOINV'].includes(data[9]);
    if (!toggleOngoingFilter.checked) return !['ONGOING', 'READYTOINV'].includes(data[9]);

    return true;
  });

  const jobTable = $('#job-table').DataTable({
    paging: false,
    responsive: true,
    order: [
      [9, 'asc'],
      [7, 'desc'],
      [3, 'asc'],
    ],
    orderClasses: false,
    rowId: 'id',
    language: {
      searchPlaceholder: 'ジョブを探す',
      search: '',
    },
    preDrawCallback: function (settings) {
      totalExpectedRevenueAmt = 0;
    },
    drawCallback: function (settings) {
      setExpectedRevenueDisplayText();
      updateRevenueDisplay(viewingYear, viewingMonth);
      totalExpectedRevenueDisplay.textContent = `¥${totalExpectedRevenueAmt.toLocaleString()}`;
    },
    ajax: {
      url: '/pipeline/pipeline-data/' + viewingYear + '/' + viewingMonth + '/',
      dataSrc: function (json) {
        return json.data;
      },
    },
    columns: [
      {
        data: null,
        responsivePriority: 2,
        render: function (data, type, row) {
          return `<input type='checkbox' name='select' value=${row.id} class='form-check-input'>`;
        },
      },
      {
        data: 'client_name',
        responsivePriority: 5,
        render: function (data, type, row) {
          return `<a href="client-update/${row.client_id}">${data}</a>`;
        },
      },
      {
        data: 'job_name',
        className: 'job-label',
        responsivePriority: 1,
        render: {
          display: function (data, type, row) {
            function truncate(string) {
              return string.length > 20 ? string.substr(0, 15) + '...' : string;
            }
            return row.invoice_name
              ? `<a href="/pipeline/${row.id}/job-detail/">INV: ${truncate(
                  row.invoice_name
                )}</a>`
              : `<a href="/pipeline/${row.id}/job-detail/">${truncate(data)}</a>`;
          },
          sort: function (data) {
            return data;
          },
        },
      },
      { data: 'job_code' },
      {
        data: 'revenue',
        className: 'pe-4 revenue-amt',
        responsivePriority: 3,
        render: function (data, type, row) {
          return `¥${data.toLocaleString()}`;
        },
      },
      {
        data: 'total_cost',
        className: 'pe-4',
        responsivePriority: 4,
        render: function (data, type, row) {
          return `<a href="/pipeline/cost-add/${row.id}/">¥${data.toLocaleString()}</a>`;
        },
      },
      {
        data: 'profit_rate',
        className: 'pe-4',
        width: '120px',
        render: function (data) {
          return `${data}%`;
        },
      },
      {
        data: 'job_date',
        className: 'invoice-period',
        render: {
          display: function (data) {
            let date = new Date(data);
            return data ? `${date.getFullYear()}年${date.getMonth() + 1}月` : '---';
          },
          sort: function (data) {
            return data;
          },
        },
      },
      {
        data: 'job_type',
        name: 'job_type',
      },
      {
        data: 'status',
        name: 'status',
        responsivePriority: 6,
        render: {
          display: function (data, type, row) {
            const STATUSES = row.job_status_choices;
            let selectEl = document.createElement('select');
            selectEl.classList.add('form-control-plaintext', 'job-status-select');
            selectEl.setAttribute('name', 'job_status');
            for (const [_, status] of Object.entries(STATUSES)) {
              let optionEl = document.createElement('option');
              optionEl.value = status[0];
              optionEl.text = status[1];
              if (status[0] === data) optionEl.setAttribute('selected', '');
              selectEl.appendChild(optionEl);
            }
            return selectEl.outerHTML;
          },
          sort: function (data, type, row) {
            console.log(type);
            return data;
          },
        },
        orderDataType: 'dom-job-select',
      },
      {
        data: 'deposit_date',
        name: 'deposit_date',
        className: 'deposit-date',
        defaultContent: '---',
      },

      {
        data: 'invoice_info_completed',
        name: 'invoice_info_completed',
        render: function (data, type, row) {
          return row.invoice_name && row.month && row.year ? true : false;
        },
        visible: false,
      },
      {
        data: 'client_id',
        name: 'client_id',
        visible: false,
      },
    ],
    columnDefs: [
      {
        target: 0,
        className: 'dt-center',
        searchable: false,
      },
      {
        targets: [4, 5, 6],
        className: 'dt-right',
      },
      {
        targets: [4, 5, 6],
        createdCell: function (td, cellData, rowData, row, col) {
          $(td).addClass('font-monospace');
        },
      },
    ],
    rowCallback: function (row, data) {
      const statusCell = $(row).find('.job-status-select');
      const initialStatus = statusCell.val();
      const depositDateCell = $(row).find('.deposit-date');

      if (['INVOICED1', 'INVOICED2', 'FINISHED'].includes(data.status)) {
        row.classList.add('job-invoiced');
      }

      ['INVOICED1', 'INVOICED2', 'FINISHED'].includes(statusCell.val())
        ? depositDateCell.removeClass('text-body-tertiary')
        : depositDateCell.addClass('text-body-tertiary');

      statusCell.attr('data-initial', initialStatus);
      initialStatus === 'FINISHED'
        ? $(row).addClass('job-finished')
        : $(row).removeClass('job-finished');
      ['ONGOING', 'READYTOINV'].includes(initialStatus)
        ? $(row).addClass('job-ongoing')
        : $(row).removeClass('job-ongoing');
      totalExpectedRevenueAmt += parseInt(data.revenue);
    },
    createdRow: function (row, data, dataIndex) {
      if (data.deposit_date === null) {
        row.classList.add('payment-unreceived');
      }
    },
  });

  jobTable.on('click', 'td.deposit-date', function () {
    currentRowID = $(this).closest('tr').attr('id');
    row = jobTable.row(`#${currentRowID}`).node();
    jobStatus = $(row).find('select.job-status-select option:selected').val();

    if (['INVOICED1', 'INVOICED2', 'FINISHED'].includes(jobStatus)) {
      depositDateModal = new bootstrap.Modal(document.querySelector('#set-deposit-date'));
      depositDateModal.show();
    }
  });

  $('#deposit-date-form').on('submit', function (event) {
    event.preventDefault();
    var depositDateData = new FormData();
    depositDateData.append('deposit_date', $('#id_deposit_date').val());
    depositDateData.append('job_id', currentRowID);
    depositDateData.append('set_deposit_date', true);
    let url = `/pipeline/set-deposit-date/${currentRowID}/`;
    function successCallback(newRowData) {
      jobTable.row(`#${newRowData.id}`).data(newRowData).invalidate().draw(false);
      depositDateModal.hide();
      $('#deposit-date-form')[0].reset();
    }
    jobTableAjaxCall(depositDateData, url, successCallback);
  });

  let rangeCheckbox = $('#csv-export-use-range');
  rangeCheckbox.click(function () {
    if (rangeCheckbox.is(':checked')) {
      $('#thru-month').removeClass('invisible');
      $('#thru-year').removeClass('invisible');
    } else {
      $('#thru-month').addClass('invisible');
      $('#thru-year').addClass('invisible');
      $('#thru-month').val($('#from-month').val()).change();
      $('#thru-year').val($('#from-year').val()).change();
    }
  });
  $('#from-month').change(function () {
    if (rangeCheckbox.is(':not(:checked)')) {
      $('#thru-month').val($('#from-month').val()).change();
    }
  });
  $('#from-year').change(function () {
    if (rangeCheckbox.is(':not(:checked)')) {
      $('#thru-year').val($('#from-year').val()).change();
    }
  });
  $('.update-cost-table').click(function () {
    var forms = document.getElementsByTagName('form');
    for (var i = 0; i < forms.length; i++) {
      forms[i].submit();
    }
  });

  function updateRevenueDisplay(year, month) {
    $.ajax({
      headers: { 'X-CSRFToken': csrftoken },
      type: 'GET',
      url: '/pipeline/revenue-data/' + year + '/' + month + '/',
      processData: false, // prevents jQuery from processing the data
      contentType: false, // prevents jQuery from setting the Content-Type header

      success: function (response) {
        $('#total-revenue-ytd').text(response.total_revenue_ytd);
        $('#avg-revenue-ytd').text(response.avg_monthly_revenue_ytd);
        $('#total-revenue-monthly-act').text(response.total_revenue_monthly_actual);
      },
    });
  }

  function getJobUpdate(selectElement) {
    /*
     * Returns a FormData object containing the value of the select element
     */
    var formData = new FormData();
    if ($(selectElement).hasClass('job-status-select')) {
      formData.append('status', $(selectElement).val());
    } else {
      alert('There was a problem getting the form data');
    }
    return formData;
  }

  function jobTableAjaxCall(formData, url, successCallBack, errorCallBack) {
    $.ajax({
      headers: { 'X-CSRFToken': csrftoken },
      type: 'POST',
      url: url,
      data: formData,
      processData: false,
      contentType: false,
      success: function (response) {
        if (response.status === 'success') {
          var newData = response.data;
          successCallBack(newData);
        } else {
          console.log('Something happend - perhaps the form received bad data.');
        }
      },
      error: function () {
        if (typeof errorCallBack === 'function') {
          errorCallBack();
        } else {
          console.log('Error occurred during the AJAX request');
        }
      },
    });
  }

  $('#pipeline-new-client-btn').click(function () {
    openInvoiceInfoModal = false;
  });

  jobTable.on('change', '.job-status-select', function () {
    /*
     * When a user changes the job status via the status dropdown, if one
     * of the 'finalizing' statuses is selected e.g. 'Completed & Invoiced',
     * and the invoice data hasn't been added, a modal form opens so the information can be added.
     * Otherwise, the status is simply updated.
     *
     * Additional logic is added to make a seamless transition between
     * the invoice data modal and a separate modal for adding a new client,
     * in the case the invoice recipient is a client that isn't in the db yet.
     */

    const newClientFormModalEl = document.querySelector('#new-client-modal');
    const invoiceInfoModal = new bootstrap.Modal(
      document.getElementById('set-job-invoice-info')
    );
    const invoiceInfoModalEl = document.querySelector('#set-job-invoice-info');

    newClientFormModalEl.addEventListener('hide.bs.modal', function () {
      if (openInvoiceInfoModal === true) {
        invoiceInfoModal.show();
      }
    });

    var changedSelectFormData = getJobUpdate(this);
    var statusSelectEl = $(this);
    var selectedStatus = statusSelectEl.val();
    var initialStatus = statusSelectEl.data('initial');
    var rowID = $(this).closest('tr').attr('id');
    const invoiceInfoCompleted = JSON.parse(
      jobTable.cell('#' + rowID, 'invoice_info_completed:name').node().textContent
    );
    const requiresInvoiceInfo = ['INVOICED1', 'INVOICED2', 'FINISHED', 'ARCHIVED'];

    if (requiresInvoiceInfo.includes(selectedStatus) && invoiceInfoCompleted === false) {
      openInvoiceInfoModal = true;
      const clientID = parseInt(jobTable.cell('#' + rowID, 'client_id:name').data());

      const invoiceForm = invoiceInfoModalEl.querySelector('#invoice-info-form');
      const invoiceRecipientField = invoiceForm.querySelector(
        '#id_inv-invoice_recipient'
      );
      const hiddenJobIDField = invoiceForm.querySelector('#id_inv-job_id');

      invoiceRecipientField.value = clientID;
      hiddenJobIDField.value = rowID;
      invoiceInfoModal.show();

      function invoiceInfoSuccessCallback(newRowData) {
        const invoiceInfoSavedToast = $('#invoice-set-success-toast');
        const invoiceInfoSavedToastBS =
          bootstrap.Toast.getOrCreateInstance(invoiceInfoSavedToast);
        invoiceInfoModalEl.removeEventListener('hide.bs.modal', revertStatus);
        invoiceInfoModal.hide();
        invoiceInfoSavedToastBS.show();

        newDataInvoicePeriod = newRowData.job_date.split('-');

        newDataInvoicePeriod[1] == currentMonth && newDataInvoicePeriod[0] == currentYear
          ? jobTable.row(`#${newRowData.id}`).data(newRowData).invalidate().draw()
          : jobTable.row(`#${newRowData.id}`).remove().draw();
      }

      function showSelectedStatus() {
        statusSelectEl.val(selectedStatus);
      }

      function revertStatus() {
        statusSelectEl.val(initialStatus);
        invoiceInfoModalEl.removeEventListener('show.bs.modal', showSelectedStatus);
      }

      invoiceInfoModalEl.addEventListener('show.bs.modal', showSelectedStatus);
      invoiceInfoModalEl.addEventListener('hide.bs.modal', revertStatus);

      $(invoiceForm).on('submit', function (event) {
        event.preventDefault();
        let invoiceFormData = new FormData();
        invoiceFormData.append('inv-invoice_recipient', invoiceRecipientField.value);
        invoiceFormData.append('inv-invoice_name', $('#id_inv-invoice_name').val());
        invoiceFormData.append('inv-job_id', hiddenJobIDField.value);
        invoiceFormData.append('set_invoice_info', true);
        invoiceFormData.append('inv-year', $('#id_inv-year').val());
        invoiceFormData.append('inv-month', $('#id_inv-month').val());
        for (const entry of changedSelectFormData.entries()) {
          invoiceFormData.append('inv-' + entry[0], entry[1]);
        }
        invoiceForm.reset();

        let url = '/pipeline/set-client-invoice-info/' + hiddenJobIDField.value + '/';
        jobTableAjaxCall(invoiceFormData, url, invoiceInfoSuccessCallback, revertStatus);
      });
    } else {
      let url = '/pipeline/pl-job-update/' + rowID + '/';
      jobTableAjaxCall(changedSelectFormData, url, function (newRowData) {
        if (viewingMonth == currentMonth && viewingYear == currentYear) {
          jobTable.row(`#${newRowData.id}`).data(newRowData).invalidate().draw();
        } else {
          jobTable.row(`#${newRowData.id}`).remove().draw();
        }
      });
    }
  });

  // Job form submission
  $('#job-form').submit(function (event) {
    var spinner = $('#add-job-spinner');
    event.preventDefault();
    spinner.toggleClass('invisible');
    var formData = {
      job_name: $('#id_job_name').val(),
      client: $('#id_client').val(),
      job_type: $('#id_job_type').val(),
      granular_revenue: $('#id_granular_revenue').val(),
      revenue: $('#id_revenue').val(),
      add_consumption_tax: $('#id_add_consumption_tax').prop('checked'),
      personInCharge: $('#id_personInCharge').val(),
    };

    $.ajax({
      headers: { 'X-CSRFToken': csrftoken },
      type: 'POST',
      url: '/pipeline/job-add',
      data: formData,
      beforeSend: function () {
        spinner.removeClass('invisible');
      },
      success: function (response) {
        if (response.status === 'success') {
          // $("table").append(response.html);
          spinner.addClass('invisible');
          $('#job-form').removeClass('was-validated');
          // $(".toast").each(function() {
          //     $(this).show()
          // });
          var job = response.data;
          jobTable.row.add($(job)).draw();
          // #TODO: replace the below with the updateRevenueDisplay function using the new data
          // var originalVal = parseInt($("#total-billed-monthly-exp").text().replace(/(¥|,)/g, ''));
          // var newVal = parseInt(job.revenue.replace(/(¥|,)/g, ''));
          // var resultVal = '¥' + (originalVal + newVal).toLocaleString();
          // $("#total-billed-monthly-exp").text(resultVal)

          var toast = document.createElement('div');
          toast.classList.add(
            'toast',
            'position-fixed',
            'bg-success-subtle',
            'border-0',
            'top-0',
            'end-0'
          );
          toast.setAttribute('role', 'alert');
          toast.setAttribute('aria-live', 'assertive');
          toast.setAttribute('aria-atomic', 'true');

          var jobDescriptor =
            formData['job_name'].toUpperCase() +
            ' from ' +
            $('#id_client option:selected').text();
          var header = document.createElement('div');
          header.classList.add('toast-header');
          header.innerHTML = `
                        <i class="bi bi-check2-circle" class="rounded me-2"></i>
                        <strong class="me-auto">Job added</strong>
                        <small class="text-muted">Just now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        `;
          var body = document.createElement('div');
          body.classList.add('toast-body');
          body.innerText = jobDescriptor;

          toast.appendChild(header);
          toast.appendChild(body);

          document.body.appendChild(toast);

          var toastElement = new bootstrap.Toast(toast);
          toastElement.show();
          setTimeout(function () {
            $(toastElement).fadeOut('fast', function () {
              $(this).remove();
            });
          }, 1000);
          $('#job-form').get(0).reset();
        } else {
          console.log('it did not work');
          $('#job-form').addClass('was-validated');
          spinner.addClass('invisible');
        }
      },
      error: function (data) {
        alert('Form submission failed');
        spinner.addClass('invisible');
      },
    });
  });

  var pipelineMonth = $('#pipeline-month');
  var pipelineYear = $('#pipeline-year');
  filterEarliestYear = 2021;

  yearOption = filterEarliestYear;
  while (yearOption <= currentYear + 1) {
    pipelineYear.append(`<option value="${yearOption}">${yearOption}年</option>`);
    yearOption++;
  }

  pipelineMonth.val(currentMonth);
  pipelineYear.val(currentYear);

  function filterData(year, month) {
    var url = '/pipeline/pipeline-data/';
    if (year !== undefined && month !== undefined) {
      url = url + year + '/' + month + '/';
    }
    // jobTable.ajax.url(url).load(updateRevenueDisplay(year, month))  // using the callback function parameter of load() to display other variables on the page
    jobTable.ajax.url(url).load();
  }

  $('.toggle-view').click(function () {
    if (pipelineViewState === 'monthly') {
      pipelineViewState = 'all';
      $('#view-state').text(pipelineViewState);
      $('.monthly-item').slideUp('fast', function () {
        $('#pipeline-date-select .monthly-item').removeClass('d-flex');
      });

      $('.toggle-view').html('<b>月別で表示</b>');
      filterData(undefined, undefined);
    } else {
      pipelineViewState = 'monthly';
      currentExpectedRevenueDisplay.textContent = '表示の案件　請求総額(予定)';
      $('#view-state').text(pipelineViewState);
      $('#pipeline-date-select .monthly-item').addClass('d-flex');
      $('.monthly-item').slideDown('fast');
      $('.toggle-view').html('<b>全案件を表示</b>');
      filterData(pipelineYear.val(), pipelineMonth.val());
    }
    setExpectedRevenueDisplayText();
  });

  $('#pipeline-month, #pipeline-year').change(function () {
    filterData(pipelineYear.val(), pipelineMonth.val());
  });

  $('#pipeline-next').click(function () {
    viewingMonth = parseInt(pipelineMonth.val());
    viewingYear = parseInt(pipelineYear.val());
    if (viewingMonth != 12) {
      viewingMonth++;
    } else if (viewingYear + 1 > currentYear + 1) {
      // add some error message?
    } else {
      viewingMonth = 1;
      viewingYear++;
    }
    pipelineMonth.val(viewingMonth);
    pipelineYear.val(viewingYear);
    filterData(viewingYear, viewingMonth);
  });

  $('#pipeline-prev').click(function () {
    viewingMonth = parseInt(pipelineMonth.val());
    viewingYear = parseInt(pipelineYear.val());
    if (viewingMonth != 1) {
      viewingMonth--;
    } else if (viewingYear - 1 < filterEarliestYear) {
      // add some error message?
    } else {
      viewingMonth = 12;
      viewingYear--;
    }
    pipelineMonth.val(viewingMonth);
    pipelineYear.val(viewingYear);
    filterData(viewingYear, viewingMonth);
  });

  $('#pipeline-current').click(function () {
    viewingMonth = currentMonth;
    viewingYear = currentYear;
    pipelineYear.val(currentYear);
    pipelineMonth.val(currentMonth);
    filterData(currentYear, currentMonth);
    // updateRevenueDisplay(viewingYear, viewingMonth)
  });

  var clientForm = $('#new-client-form');
  var submitButton = clientForm.find('button[type="submit"]');

  var properNameInput = clientForm.find('input[name="proper_name"]');
  var properNameJapaneseInput = clientForm.find('input[name="proper_name_japanese"]');

  properNameInput.on('input', validateInputs);
  properNameJapaneseInput.on('input', validateInputs);

  submitButton.prop('disabled', true);

  function validateInputs() {
    /*
     * add docstring
     */
    if (properNameInput.val() || properNameJapaneseInput.val()) {
      submitButton.prop('disabled', false);
    } else {
      submitButton.prop('disabled', true);
    }
  }

  //New Client form submission
  $('#new-client-form').submit(function (event) {
    var spinner = $('#add-client-spinner');
    event.preventDefault();
    spinner.removeClass('invisible');
    // $("#add-job-spinner").addClass('testclass')
    var formData = {
      friendly_name: $('#id_friendly_name').val(),
      job_code_prefix: $('#id_job_code_prefix').val(),
      proper_name: $('#id_proper_name').val(),
      proper_name_japanese: $('#id_proper_name_japanese').val(),
      new_client: 'new ajax client add',
    };
    $.ajax({
      headers: { 'X-CSRFToken': csrftoken },
      type: 'POST',
      url: '/pipeline/',
      data: formData,
      beforeSend: function () {
        spinner.removeClass('invisible');
      },
      success: function (response) {
        if (response.status === 'success') {
          spinner.addClass('invisible');
          $('#id_client').append(
            $('<option></option>')
              .val(response.id)
              .text(`${response.value} - ${response.prefix}`)
          );
          $('#id_client').val(response.id);
          $('#id_invoice_recipient').append(
            $('<option></option>')
              .val(response.id)
              .text(`${response.value} - ${response.prefix}`)
          );
          $('#id_invoice_recipient').val(response.id);
          $('#new-client-form').removeClass('was-validated');
          $('.toast').each(function () {
            $(this).show();
          });
          $('#new-client-modal').modal('toggle');
          $('#new-client-form')[0].reset();

          // create and instantiate toast for successful client creation
          var toast = document.createElement('div');
          toast.classList.add(
            'toast',
            'position-fixed',
            'bg-success-subtle',
            'border-0',
            'top-0',
            'end-0'
          );
          toast.setAttribute('role', 'alert');
          toast.setAttribute('aria-live', 'assertive');
          toast.setAttribute('aria-atomic', 'true');

          var descriptor = formData['friendly_name'].toUpperCase();
          var header = document.createElement('div');
          header.classList.add('toast-header');
          header.innerHTML = `
                        <i class="bi bi-check2-circle" class="rounded me-2"></i>
                        <strong class="me-auto">New client added</strong>
                        <small class="text-muted">Just now</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                        `;
          var body = document.createElement('div');
          body.classList.add('toast-body');
          body.innerText = descriptor;

          toast.appendChild(header);
          toast.appendChild(body);

          document.body.appendChild(toast);

          var toastElement = new bootstrap.Toast(toast);
          toastElement.show();
          setTimeout(function () {
            $(toastElement).fadeOut('fast', function () {
              $(this).remove();
            });
          }, 1000);
        } else {
          $('#new-client-form').addClass('was-validated');
          spinner.addClass('invisible');
        }
      },

      error: function (request) {
        alert('form not submitted');
        $(this).addClass('was-validated');
        spinner.addClass('invisible');
      },
    });
  });

  $('#batch-pay-csv-dl').on('submit', function (e) {
    e.preventDefault();
    $.ajax({
      headers: { 'X-CSRFToken': csrftoken },
      type: 'POST',
      url: '/pipeline/prepare-batch-payment/',
      data: '',
      success: function (data, testStatus, xhr) {
        var blob = new Blob([data]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'WISE_batch_payment.csv';
        link.click();

        var processingStatus = JSON.parse(xhr.getResponseHeader('X-Processing-Status'));
        console.log('Processing status:', processingStatus);

        var batchProcessSuccess = [];
        var batchProcessError = [];
        const successToast = document.getElementById('payment-template-success-toast');
        const errorToast = document.getElementById('payment-template-error-toast');
        const successToastBody = successToast.querySelector('.toast-body');
        const errorToastBody = errorToast.querySelector('.toast-body');

        for (var key in processingStatus) {
          for (var key in processingStatus) {
            if (processingStatus[key].status == 'success') {
              batchProcessSuccess[key] = processingStatus[key];
            } else if (processingStatus[key].status == 'error') {
              batchProcessError[key] = processingStatus[key];
            } else {
              alert('Unknown error during processing!');
            }
          }
        }
        successToastBody.innerHTML = '';
        errorToastBody.innerHTML = '';
        for (const i in batchProcessSuccess) {
          successToastBody.innerHTML += `
                        <li>${i}: ${batchProcessSuccess[i].message}</li>
                        `;
        }
        for (const i in batchProcessError) {
          errorToastBody.innerHTML += `
                        <li>${i}: ${batchProcessError[i].message}</li>
                        `;
        }
        const successToastBS = bootstrap.Toast.getOrCreateInstance(successToast);
        const errorToastBS = bootstrap.Toast.getOrCreateInstance(errorToast);
        if (Object.keys(batchProcessSuccess).length > 0) {
          successToastBS.show();
        }

        if (Object.keys(batchProcessError).length > 0) {
          errorToastBS.show();
        }
      },
    });
  });

  unreceivedFilter.addEventListener('change', () => {
    jobTable.draw();
  });
  showOnlyOngoingFilter.addEventListener('change', () => {
    jobTable.draw();
  });
  toggleOngoingFilter.addEventListener('change', () => {
    jobTable.draw();
  });
});
