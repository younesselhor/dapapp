// time-ago.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow } from 'date-fns';

@Pipe({
  name: 'timeAgo',
  standalone: true, // Angular 15+
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  }
}
