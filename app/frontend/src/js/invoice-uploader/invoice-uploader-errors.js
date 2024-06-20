import { createErrorToast, dropzoneErrorMessages } from './invoice-uploader-view.js';
import { stripTags } from '../utils.js';
import { myDropzone } from './invoice-uploader.js';
import { error } from 'jquery';

export function getErrorMessageContent({
  responseCode,
  file = null,
  jobName = null,
} = {}) {
  const ERR_MESSAGES = {
    9999: { title: `Error`, message: `This is a default error message.` },
    9998: {
      title: `${jobName ? `${jobName}` : 'Error'}`,
      message: `This is an error with more details. ${file?.cleanName || ''}`,
    },
    1001: {
      title: `Couldn't add file${file ? `: ${file.cleanName}` : ''}`,
      message: `This file has already been added.`,
    },
    1002: {
      title: `Couldn't add file${file ? `: ${file.cleanName}` : ''}`,
      message: `A file with the same PO number has already been added.`,
    },
    1003: {
      title: `Couldn't add file${file ? `: ${file.cleanName}` : ''}`,
      message: `This file matches ${jobName}, but there's already an invoice attached to it. Please double check and try again.`,
    },
    1004: {
      title: `Couldn't add file${file ? `: ${file.cleanName}` : ''}`,
      message: `The PO# in the filename <span class="bold">(${
        file?.PONumber
      })</span> doesn't match the job you are attempting to submit it for <span class="bold">${
        jobName ? ` (${jobName})` : ''
      }</span>. To avoid payment issues, please double check the filename and try adding it again.`,
    },
    1101: {
      title: `${jobName}`,
      message: `This job already has an invoice attached! Please choose another job.`,
    },
    3001: {
      title: `File is too big (${Math.round(file.size / 1024 / 1024)}MiB)`,
      message: `Files must be smaller than 10MiB.`,
    },
    3002: {
      title: `Wrong file type`,
      message: `Files must be in .pdf or .jpg format.`,
    },
  };

  return (
    ERR_MESSAGES[responseCode] || {
      title: 'Unknown error',
      message: `${jobName} / ${file?.cleanName}`,
    }
  );
}

export function handleError(
  file = null,
  {
    responseCode = null,
    autoDeleteErrorMsg = null,
    deleteFile = null,
    jobName = null,
  } = {},
) {
  const msg = getErrorMessageContent({ responseCode, file: file, jobName });
  console.warn(stripTags(msg.message));

  const errorToast = createErrorToast(msg);
  if (file && deleteFile) {
    myDropzone.removeFile(file);
  } else if (file) {
    errorToast.dataset.filename = file.cleanName;
  }

  dropzoneErrorMessages.append(errorToast);
  if (autoDeleteErrorMsg) fadeOut(errorToast);
}

function fadeOut(element) {
  // Currently uses 7s transition delay on the toast element. Maybe there's a better way?
  setTimeout(() => {
    element.classList.add('fade--transitioning');
    element.classList.remove('fade--shown');
  }, 10);

  setTimeout(() => element.remove(), 7500);
}
