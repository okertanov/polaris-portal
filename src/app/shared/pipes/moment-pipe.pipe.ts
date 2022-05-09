import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

export enum Format {
  FROM_NOW = 'fromNow'
}

@Pipe({
  name: 'momentPipe'
})
export class MomentPipePipe implements PipeTransform {

  transform(value: number, format: string): string {
    let time: string;
    if (!value) {
      time = '-- --';
    } else {
      const fromNow = format === Format.FROM_NOW;
      time = fromNow ? moment(value).fromNow() : moment(value).format(format);
    }

    return time;
  }

}
