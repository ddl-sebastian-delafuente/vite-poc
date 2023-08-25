import * as React from 'react';
import $ from 'jquery';
import { error as errorToast } from '../components/toastr';
import HelpLink from '../components/HelpLink';
import Link from '../components/Link/Link';
import { SUPPORT_ARTICLE } from '../core/supportUtil';
import withStore, { StoreProps } from '../globalStore/withStore';
import { getAppName } from '../utils/whiteLabelUtil';

export type Props = {
  hideDropZone: () => void;
  maxUploadFiles: number;
  downloadCLIPageEndpoint: string;
  maxUploadFileSizeInMegabytes: number;
  uploadEndpoint: string;
  successfulUploadUrl: string;
} & StoreProps;

export type State = Props;

/**
 * WARNING
 * This is a jQuery component
 * Do not change from a pure component.
 * Purecomponent safeguards against accidental rerenderings and removal of the uploader by react
 */
class DropZoneUploader extends React.PureComponent<Props, State> {
  dropzone: any = null;

  dragEnterCounts = 0;

  canShowMoreDropzoneErrors = true;

  uploadingFiles = false;

  constructor(props: Props) {
    super(props);
    this.state = props;
  }

  componentDidMount() {
    const {
      maxUploadFiles,
      maxUploadFileSizeInMegabytes,
      uploadEndpoint,
      successfulUploadUrl,
    } = this.state;
    const previewTemplate =  document.getElementById('preview-template');
    if (previewTemplate) {
      previewTemplate.setAttribute('style', 'display:none;');
    }

    $('#commitChangesBtn').prop('disabled', true);

    const onDragLeave = () => {
      this.dragEnterCounts -= 1;
      if (this.dragEnterCounts === 0) {
        $(document.body).css({'opacity' : 1});
        $('.body-border').hide();
      }
    };

    const dropzoneAddedFile = () => {
      dropzoneFilesChanged();
    };

    const dropzoneAddedFiles = () => {
      this.canShowMoreDropzoneErrors = true;
    };

    const dropzoneFilesChanged = () => {
      this.updateElementsState();
    };

    // A bug in chrome makes it so that there are 3 events fired once pointer enters the screen:
    // dragenter, dragenter, dragleave.
    // http://stackoverflow.com/questions/7110353/html5-dragleave-fired-when-hovering-a-child-element
    // @ts-ignore
    window.Dropzone.autoDiscover = false;

    // @ts-ignore
    this.dropzone = new window.Dropzone(document.body,
      {
        previewsContainer: '#uploader',
        clickable: '#uploader',
        url: uploadEndpoint,
        paramName: 'files',
        previewTemplate: previewTemplate ? previewTemplate.innerHTML : undefined,
        addRemoveLinks: true,
        dictRemoveFile: '\u00D7',
        dictCancelUpload: '',
        createImageThumbnails: false,
        uploadMultiple: true,
        autoProcessQueue: false,
        parallelUploads: maxUploadFiles,
        maxFiles: maxUploadFiles,
        maxFilesize: maxUploadFileSizeInMegabytes,
        filesizeBase: 1024,
        dictMaxFilesExceeded: 'You can not upload any more files. You can upload up to {{maxFiles}} files at a time.',
        renameFilename: (filename: string, file: { fullPath?: string }) => {
          return file.fullPath ? file.fullPath : filename;
        }
      }
    );

    this.dropzone.on('successmultiple', () => {
      this.setUploadingFiles(false);
      this.hideUploadComponent();
      window.location.href = successfulUploadUrl;
      window.location.reload();
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.dropzone.on('errormultiple', (files: any[], result: any, request: any) => {
      console.error('Failed to upload all files.', result);

      if (this.uploadingFiles) {
        // still want to show the error when there is no JSON.
        const errorToDisplay = result.message ? result.message : result
        errorToast(errorToDisplay);
        this.setUploadingFiles(false);
        this.updateElementsState();
      } else {
        if (this.canShowMoreDropzoneErrors) {
          errorToast(result.message);
          this.canShowMoreDropzoneErrors = false;
          // Workaround not to show lots of error messages when user adds a lot of files.
        }
        this.updateElementsState();
      }
    });
    this.dropzone.on('addedfile', dropzoneAddedFile);
    this.dropzone.on('addedfiles', dropzoneAddedFiles);
    this.dropzone.on('removedfile', dropzoneFilesChanged);
    this.dropzone.on('dragenter', () => {
      this.dragEnterCounts += 1;
      $('.body-border').show();
      $(document.body).css({'opacity' : 0.5});
    });
    this.dropzone.on('dragleave', onDragLeave);
    this.dropzone.on('drop', onDragLeave);

    this.showUploadComponent();
  }

  componentWillUnmount = () => {
    this.dropzone.destroy();
  }

  dropzoneIsFileTooLarge = (file: any) => {
    return file.size > this.dropzone.options.maxFilesize * 1024 * 1024;
  }

  countTooLargeFiles = () => {
    const tooLargeFiles = $.map(this.dropzone.files, (file: any) => {
      if (this.dropzoneIsFileTooLarge(file)) {
        return true;
      } else {
        return null;
      }
    });
    return tooLargeFiles.length;
  }

  showUploadComponent = () => {
    $('#uploaderRow').removeClass('hidden');
    this.enableDropzone();
  }

  updateElementsState = () => {
    const queuedAndAddedFilesCount = this.dropzone.getAddedFiles().length + this.dropzone.getQueuedFiles().length;
    const isTooLargeFilesError = this.countTooLargeFiles() > 0;
    const isTooManyFilesError = this.dropzone.files.length > this.dropzone.options.maxFiles;
    const isBulkUploadWarning = this.dropzone.files.length > 100;
    const isError = isTooLargeFilesError || isTooManyFilesError;
    const commitChangesBtnEnabled = queuedAndAddedFilesCount === 0 || isError || this.uploadingFiles;

    $('#commitChangesBtn').prop('disabled', commitChangesBtnEnabled);
    $('#dropzoneTooLargeFilesErrorMessage').toggleClass('hidden', !isTooLargeFilesError);
    $('#dropzoneTooManyFilesErrorMessage').toggleClass('hidden', !isTooManyFilesError);
    $('#dropzoneBulkFileUploadWarning').toggleClass('hidden', !isBulkUploadWarning);


    if (this.uploadingFiles) {
      $('#commitChangesBtn').html('<i class=\'icon-spinner icon-spin\'></i> Uploading...');
      this.disableDropzone();
    } else {
      $('#commitChangesBtn').html('Upload');
      this.enableDropzone();
    }
  }

  hideUploadComponent = () => {
    $('#uploaderRow').addClass('hidden');
    $('#uploadBtn').prop('disabled', false);
    this.disableDropzone();
  }

  uploadFiles = () => {
    this.setUploadingFiles(true);
    this.dropzone.processQueue();
  }

  cancelUpload = () => {
    this.dropzone.removeAllFiles(true);
    this.setUploadingFiles(false);

    // @ts-ignore
    window.Dropzone.forElement(document.body).destroy();

    this.props.hideDropZone();
  }

  setUploadingFiles = (newValue: any) => {
    this.uploadingFiles = newValue;
    this.updateElementsState();
  }

  disableDropzone = () => {
    $('#uploader').removeClass('dz-clickable');
    $(document.body).css({'opacity' : 1});
    this.dropzone.removeEventListeners();
  }

  enableDropzone = () => {
    $('#uploader').addClass('dz-clickable');
    this.dropzone.setupEventListeners();
  }

  render() {
    const {
      maxUploadFileSizeInMegabytes,
      maxUploadFiles,
      downloadCLIPageEndpoint,
    } = this.state;
    const { whiteLabelSettings } = this.props;
    const appName = getAppName(whiteLabelSettings);
    return (
      <div id="uploaderRow" data-test="DropZoneUploader">
        <div id="uploaderArea" data-test="DropZoneUploaderArea">
          <div id="uploader">
            <div className="target">
              <i className="glyphicon glyphicon-cloud-upload" />
              <strong>DRAG &amp; DROP</strong>
              your files anywhere, or <Link>browse for files</Link>
            </div>
            </div>
            <div id="uploaderInputs">
              <p className="text-danger hidden" id="dropzoneTooManyFilesErrorMessage">
                <i className="icon-warning-sign" />
                  File uploads are limited to {maxUploadFiles} at a time. Use the
                  <Link href={downloadCLIPageEndpoint}>{`${appName} CLI`}</Link>
                  to upload more than {maxUploadFiles} at a time.
              </p>
              <p className="text-danger hidden" id="dropzoneTooLargeFilesErrorMessage">
                <i className="icon-warning-sign" /> File size may not exceed
                {` ${maxUploadFileSizeInMegabytes}`} MB. Use the <Link
                  href={downloadCLIPageEndpoint}
                >
                  {`${appName} CLI`}
                </Link> to upload large files.
              </p>
              <p className="text-danger hidden" id="dropzoneBulkFileUploadWarning">
                <i className="icon-warning-sign" />
                  You are uploading a large number of files. This may take a while.
                  We recommend using the&nbsp;
                  <Link href={downloadCLIPageEndpoint}>{`${appName} CLI`}</Link>
                  &nbsp;to upload a large number of files.
              </p>
              <div>
                <button
                  data-test="StartUploadButton"
                  type="button"
                  id="commitChangesBtn"
                  className="btn btn-primary"
                  onClick={this.uploadFiles}
                >
                  Upload
                </button>
                <button
                  data-test="CancelUploadButton"
                  type="button"
                  className="btn btn-link"
                  onClick={this.cancelUpload}
                >
                  Cancel
                </button>
              </div>
              <p className="help-block">
                <i className="icon-question-sign" />
                  Files matching <HelpLink
                    articlePath={SUPPORT_ARTICLE.PROJECT_SETUP_IGNORE_FILES}
                    text=".dominoignore rules"
                    showIcon={true}
                  /> will not be uploaded.
              </p>
              <p className="help-block">
                <i className="icon-question-sign"/>
                File size may not exceed {maxUploadFileSizeInMegabytes} MB
                and uploads are limited to {maxUploadFiles} files at a time. You can also use the <Link
                  href={downloadCLIPageEndpoint}
                >
                  {`${appName} CLI`}
                </Link> to upload large volumes of files.
              </p>
            </div>
        </div>
        <div id="preview-template" className="dz-preview dz-file-preview">
          <div className="dz-details">
            <div className="dz-filename">
              <i className="icon-file-alt" /> <span data-dz-name={true} />
            </div> <div className="dz-size" data-dz-size={true} style={{fontWeight: 'bold'}}/>
          </div>
          <div className="dz-progress"><span className="dz-upload" data-dz-uploadprogress={true} /></div>
          <div className="dz-success-mark"><span>success</span></div>
          <div className="dz-error-mark"><span>error</span></div>
          <div className="dz-error-message"><span data-dz-errormessage={true} /></div>
        </div>
      </div>
    );
  }
}

export default withStore(DropZoneUploader);
