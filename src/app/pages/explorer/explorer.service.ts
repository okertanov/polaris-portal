import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AreaTypes, BlockForTable, BlockInfo, SearchParams } from '@app/pages/explorer/explorer.interfaces';
import { APIService } from '@app/shared/services/api.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

type RequestMethod = 'get' | 'post' | 'put' | 'delete';

@Injectable({
  providedIn: 'root',
})
export class ExplorerService {
  private apiUrl = environment.baseURL(this.api.getNetwork());

  constructor(private readonly http: HttpClient, private readonly api: APIService, private router: Router) {}

  get(endpoint: string, params: any = null, repeat: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`, { params }).pipe(retry(repeat));
  }

  post(endpoint: string, data: any = null): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  prepareBlocksData(data: BlockInfo[]): BlockForTable[] {
    return data.map((row: any) => ({
      hash: row?.hash,
      height: row?.index,
      time: moment(row?.timestamp).fromNow(),
      size: row?.size,
      createdOn: moment(row?.timestamp).format('DD.MM.YYYY | hh:mm:ss'),
      transactions: row?.transactions?.length || 0,
    }));
  }

  search(term: string): void {
    const searchParams = { term, context: 'global' };
    this.post('search', searchParams).subscribe(res => this.searchNavigation(res?.[0]));
  }

  private searchNavigation(searchParams: SearchParams): Promise<boolean> | void {
    const { area, entity } = searchParams;
    switch (area) {
      case AreaTypes.BLOCK:
        return this.router.navigate([`/blocks/${entity}`]);
      case AreaTypes.TRANSACTION:
        return this.router.navigate([`/transactions/${entity}`]);
      case AreaTypes.CONTRACT:
        return this.router.navigate([`/assets/${entity}`]);
      default:
        return;
    }
  }
}
