/**
 * Trim everything from a string after the first linebreak.
 */
export const trimExtraLines = (message: string) => {
  message.trimLeft();

  // only display until first \n.
  const idxLineBreak = message.indexOf('\n');
  const shortMessage = idxLineBreak > 0 ? message.substr(0, idxLineBreak).trimRight() : message;
  return shortMessage;
};
