import moment from 'moment';

export const unixTimestampFormatter = (timestamp: number) => moment(timestamp).format('MMMM Do YYYY, h:mm:ss a');
