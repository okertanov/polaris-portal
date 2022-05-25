import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormTypesData } from '@app/pages/assets/assets.interface';
import { APIService } from '@app/shared/services/api.service';
import { CustomValidators } from '@app/shared/validators/whitespace.validator';
import { combineLatest, Observable, of } from 'rxjs';
import { map, mergeMap, retry } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export enum AssetsFormType {
  TOKEN = 'token',
  NFT = 'nft',
  CODE = 'code',
}

export enum SubmitBtnName {
  TOKEN = 'Create Token',
  NFT = 'Create Token',
  CODE = 'Create Token',
}

enum FormEndpoints {
  TOKEN = 'contracts/create/token',
  NFT = 'contracts/create/nft',
  CODE = 'contracts/create/source',
}

@Injectable({
  providedIn: 'root',
})
export class AssetsService {
  private apiUrl = environment.baseURL(this.api.getNetwork());
  private assetsForm: FormGroup = new FormGroup({});
  private formBuilder: FormBuilder = new FormBuilder();
  private formTypes: FormTypesData[] = [
    { name: 'Token Smart Contract', type: AssetsFormType.TOKEN },
    { name: 'NFT Smart Contract', type: AssetsFormType.NFT },
    /*{ name: 'Source Code', type: AssetsFormType.CODE },*/
  ];

  constructor(private readonly http: HttpClient, private readonly api: APIService) {
    this.createAssetsForm();
  }

  get(endPoint: string, params: any = null, repeat: number = 0): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endPoint}`, { params }).pipe(retry(repeat));
  }

  post(endPoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endPoint}`, data);
  }

  sendForm(submitType: string, data: any): Observable<any> {
    const endpoint =
      submitType === AssetsFormType.TOKEN
        ? FormEndpoints.TOKEN
        : submitType === AssetsFormType.NFT
        ? FormEndpoints.NFT
        : FormEndpoints.CODE;
    return this.post(endpoint, data);
  }

  getAllAssets(): Observable<any> {
    return this.get('contracts/deployed');
  }

  getAssetsByHash(scriptHash: any): Observable<any> {
    return this.http.get(`${this.apiUrl}/contracts/hash/${scriptHash}`);
  }

  get form(): FormGroup {
    return this.assetsForm;
  }

  get formTypesData(): FormTypesData[] {
    return this.formTypes;
  }

  getSubmitBtnName(data: 'token' | 'nft' | 'code'): string {
    return data === AssetsFormType.TOKEN
      ? SubmitBtnName.TOKEN
      : data === AssetsFormType.NFT
      ? SubmitBtnName.NFT
      : SubmitBtnName.CODE;
  }

  uploadToAws(file: File, formType: 'token' | 'nft' | 'code'): void {
    this.http
      .get<{ Key: string; uploadURL: string }>(environment.fileUploadAwsUrl, {
        params: new HttpParams().set('name', file.name).set('type', file.type),
      })
      .pipe(
        mergeMap(result => combineLatest([of(result), this.uploadAws(result.uploadURL, file)])),
        map(([result, _]) => this.getFileAwsUrl(result.Key))
      )
      .subscribe(url => this.updateFileUrl(formType, url));
  }

  private uploadAws(uploadURL: string, file: File): Observable<any> {
    return this.http.put<any>(uploadURL, file, { headers: { 'Content-Type': file.type } });
  }

  private getFileAwsUrl(fileName: string): string {
    return `${environment.fileAwsBaseUrl}/${fileName}`;
  }

  private updateFileUrl(formType: string, url: string): void {
    const form = this.assetsForm.get(formType) as FormGroup;
    form.get('iconUrl')?.patchValue(url);
  }

  private createAssetsForm(): void {
    this.assetsForm = this.formBuilder.group({
      [AssetsFormType.TOKEN]: this.formBuilder.group({
        name: ['', Validators.required],
        symbol: ['', [Validators.required, CustomValidators.noWhiteSpace]],
        decimals: [8, [Validators.required, Validators.min(0), Validators.max(18)]],
        initial: ['', Validators.required],
        iconUrl: ['', Validators.required],
        description: [''],
      }),
      [AssetsFormType.NFT]: this.formBuilder.group({
        name: ['', Validators.required],
        symbol: ['', Validators.required],
        iconUrl: ['', Validators.required],
        description: [''],
      }),
      [AssetsFormType.CODE]: this.formBuilder.group({
        description: [''],
      }),
      type: ['token', Validators.required],
    });
  }
}
