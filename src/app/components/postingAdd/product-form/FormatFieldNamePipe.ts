import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatFieldName'
})
export class FormatFieldNamePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    
    // Convert snake_case to Title Case
    return value.split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}