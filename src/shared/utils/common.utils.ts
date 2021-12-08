import { v4 } from 'uuid';
import * as moment from 'moment';
import { isValidObjectId } from 'mongoose';

export const uuid = () => v4();

export const daysFromNow = (days: number) =>
  moment().add(days, 'days').toDate();

export const isExpired = (time) => moment().isAfter(moment(time));

export const isValidId = (id) => isValidObjectId(id);
