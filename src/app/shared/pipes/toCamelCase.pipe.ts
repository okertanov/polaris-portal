import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toCamelCase' })
export class ToCamelCasePipe implements PipeTransform {
  transform(str: string): string {
    // https://stackoverflow.com/a/2970667/1860900
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (/\s+/.test(match)) return '';
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }
}
