import { v4 } from 'uuid';
import * as moment from 'moment';

export const uuid = () => v4();

export const daysFromNow = (days: number) =>
  moment().add(days, 'days').toDate();

export const isExpired = (time) => moment().isAfter(moment(time));
