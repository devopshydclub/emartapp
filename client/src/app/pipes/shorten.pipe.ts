import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "shorten" })
export class ShortenPipe implements PipeTransform {
  transform(value: any, limit: number) {
    if (value) if (value.length > limit) return value.substr(0, limit) + "... ." + value.split(".").pop();
    return value;
  }
}
