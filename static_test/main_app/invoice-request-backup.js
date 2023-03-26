const slugify = str =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

let hintWithInvoices = "Simply choose the matching job from the dropdown menu. When you've finished, click the Submit button below.";
let hintWithNoInvoices = "Files will appear here once you've added them."

var myDropzone;
Dropzone.options.invoiceUploadForm = {
    autoProcessQueue: false,
    uploadMultiple: true,
    parallelUploads: 10,
    maxFiles: 10,
    maxFilesize: 10,
    previewsContainer: ".dropzone-previews",
    clickable: false,
    thumbnailMethod: "contain",
    acceptedFiles: ".pdf", 
    addRemoveLinks: true, 
    dictDefaultMessage: "Drop them here!",
    

    // The setting up of the dropzone
    init: function() {
        myDropzone = this;

        // First change the button to actually tell Dropzone to process the queue.
        // this.element.querySelector("button[type=submit]").addEventListener("click", function(e) {
        $("#invoice-upload-btn").on("click", function(e) { 
          // Make sure that the form isn't actually being sent.
            console.log("i've been clicked")
            e.preventDefault();
            e.stopPropagation();
            myDropzone.processQueue();
        });

        // Listen to the sendingmultiple event. In this case, it's the sendingmultiple event instead
        // of the sending event because uploadMultiple is set to true.
        this.on("sendingmultiple", function(files, xhr, formData) {
            // const formData = new FormData($("#invoice-upload-form")[0]);
            const invoices = {};
            $("select").each(function () {
                const costId = $(this).val();
                const fileName = $(this).data("file-name");
                if (costId !== "0") {
                    invoices[costId] = fileName;
                    }
            });
            formData.append("invoices", JSON.stringify(invoices))

          // Gets triggered when the form is actually being sent.
          // Hide the success button or the complete form.
        });
        this.on("successmultiple", function(files, response) {
          // Gets triggered when the files have successfully been sent.
          // Redirect user or notify of success.
        });
        this.on("errormultiple", function(files, response,) {
          // Gets triggered when there was an error sending the files.
          // Maybe show form again, and notify user of error
            console.log(response);
            for (file of files) {
                $(`#${slugify(file.name)}-form`).remove();
                if (myDropzone.getQueuedFiles().length == 0) { 
                    $('#invoice-upload-btn').addClass('disabled').parent().tooltip('dispose');
                    $("#invoice-select-area").hide();
                    if (myDropzone.getRejectedFiles().length == 0) {
                        $('#invoice-hint').text(hintWithNoInvoices);
                        $('.dz-message').show();
                    }
                    
                }
            }

        });
        this.on("removedfile", function(file) {
            console.log("rejected file length: " + myDropzone.getRejectedFiles().length)
            console.log("queued file length: " + myDropzone.getQueuedFiles().length)
            if (myDropzone.getQueuedFiles().length == 0) { 
                $('#invoice-upload-btn').addClass('disabled').parent().tooltip('dispose');
                $('#invoice-hint').text(hintWithNoInvoices);
                $("#invoice-select-area").hide();
                if (myDropzone.getRejectedFiles().length == 0) {
                        $('.dz-message').show();
                    }
            }
            $(`#${slugify(file.name)}-form`).remove();
            checkAllJobsSelected()
            checkForDuplicates()
        });
    }
}
function checkForDuplicates() {
    var duplicateExists = false;
    var dupChecker = [];
    var duplicates = []

    $('.invoice-select').each(function() {
        var currentVal = $(this).val();
        console.log(currentVal);
        if (currentVal == "0") { 
            return true;
        } else if (dupChecker.includes(currentVal)) {
            duplicates.push(currentVal)
        } else {
            dupChecker.push(currentVal);
        }
    });

    $('.invoice-select').each(function() {
        var currentVal = $(this).val();
        if (currentVal == "0") { 
            $(this).removeClass('is-valid');
            $(this).removeClass('is-invalid');
        } else if (duplicates.includes(currentVal)) {
            $(this).removeClass('is-valid');
            $(this).addClass('is-invalid');
        } else {
            $(this).removeClass('is-invalid');
            $(this).addClass('is-valid');
        }
    });
};

function checkAllJobsSelected() {
    var allSelected = true;
    console.log("ALL SELECTED " + allSelected)
    $('.invoice-select').each(function() {
      if ($(this).val() == 0) {
        allSelected = false;
        return false; // Exit the loop early if a zero value is found
      }
    console.log("QUEUED FILES: " + myDropzone.getQueuedFiles().length)
    console.log("REJECTED FILES: " + myDropzone.getRejectedFiles().length)
    console.log("ALL SELECTED " + allSelected)
    });
    // If all values are non-zero, remove the disabled class
    if (myDropzone.getQueuedFiles().length !== 0 && myDropzone.getRejectedFiles().length == 0 && allSelected) {
      $('#invoice-upload-btn').removeClass('disabled').parent().tooltip('dispose');
      $('#invoice-upload-btn').parent().tooltip();
    } else {
      $('#invoice-upload-btn').addClass('disabled').parent().tooltip('dispose');
    }
};

$(document).ready(function(){
    console.log('Ready!');

    // Dynamic dropdown menu generation logic.
    // When a file is uploaded, a dropdown is generated with all 
    // costs that are awaiting invoices that are available to that vendor.
    console.log("I see u")
    let myDropzone = new Dropzone("#invoice-upload-form");

    const costs = JSON.parse(window.costsJson);
    const jobs = window.jobsJson;
    const jobMap = {};

    for (const job of jobs) {
        // console.log(job)
        jobMap[job.pk] = {
            jobCode: job.job_code,
            jobName: job.job_name,
            display: job.job_code + " - (" + job.job_name + ")"
        }
    }
    
    let formNum = 0;
    let filenameList = []
    myDropzone.on("addedfile", function(file) {
        formNum ++;
        $(".dz-message").hide();
        // If the name, size, and last modified date of the newest file match an existing file, remove the file
        
        // var invoiceSelect = $(`<select class='form-select' id='invoice-select-${formNum}'></select>`);
        var invoiceSelect = $(`
            <div class="input-group mb-3 invoice-select-row" id="${slugify(file.name)}-form">
                <label for='invoice-select-${formNum}' class="input-group-text"><b>${file.name}</b></label>
                <select class='form-select invoice-select' id='invoice-select-${formNum}'></select>
            </div>`);
        $("#invoice-select-area").append(invoiceSelect).show()
        $("#invoice-hint").text(hintWithInvoices)
        invoiceSelect.find('select').append("<option value=0>Select job</option>")
            .attr("data-file-name", file.name);
        for (const cost of costs) {
            console.log(`File added: ${file.name}`);
            // console.log(`PO num: ${cost.fields.PO_number}`)
            // console.log(`job code: ${jobMap[cost.fields.job].jobCode}`)
            // console.log(`job pk: ${cost.fields.job}`)
            if (cost.fields.vendor === window.vendorId) {
                const option = $("<option></option>")
                .val(cost.pk)
                .text(`PO# ${cost.fields.PO_number} - Job details: ${cost.fields.description} for ${jobMap[cost.fields.job].jobName}`);
                
                if (file.name.includes(cost.fields.PO_number) || 
                    file.name.includes(jobMap[cost.fields.job].jobCode)) {
                    option.attr('selected', true);
                }
                invoiceSelect.find('select').append(option)
            }
            if ($(`#invoice-select-${formNum} :selected`).val() !== "0") {
                $(`#invoice-select-${formNum}`).addClass('is-valid');
                $(`#invoice-select-area`).trigger('change')
            }
        }
        checkAllJobsSelected()
        checkForDuplicates()
        if (this.files.length) {
                var _i, _len;
                for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) // -1 to exclude current file
                {
                    if(this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModified.toString() === file.lastModified.toString())
                    {
                        this.removeFile(file);
                    }
                }
            }
    });
    // Use event delegation to handle dynamically-generated elements
    $("#invoice-select-area").on("change", ".invoice-select", function() {
        if ($(this).val() == "0") {
            $(this).removeClass('is-valid');
        } else if ($(this).val() !== "0") {
            $(this).addClass('is-valid');
        }
        checkAllJobsSelected()
        checkForDuplicates()
    });
});


