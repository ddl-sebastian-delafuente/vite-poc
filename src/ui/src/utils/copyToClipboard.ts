import { success } from '../components/toastr';

interface Options {
  element?: 'input' | 'textarea';
  /**
   * By default copyToClipboard prepends the origin URI
   * this this value to true to prevent that from happening
   */
  excludeUri?: boolean;
}

/**
 * This function lets you copy string to the clipboard
 * @param value string to copy to clipboard
 */
export const copyToClipboard = (value: string, { excludeUri, element = 'input' }: Options = {}) => {
  const tempInput = document.createElement(element);
  tempInput.value = `${!excludeUri ? window.location.origin : ''}${value}`;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);
};

export const copyToClipboardWithSuccess = (value: string, options: Options = {}) => (successMessage: string) => {
  copyToClipboard(value, options);
  success(successMessage);
};
