import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { APIService } from './api.service';

describe('APIService', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [],
    }).compileComponents();
  });

  it('should parse Networks', () => {
    // Cast to access private
    const network1 = (APIService as any).validNetwork();
    expect(network1).toEqual('MainNet');
    const network2 = (APIService as any).validNetwork(undefined);
    expect(network2).toEqual('MainNet');
    const network3 = (APIService as any).validNetwork(null);
    expect(network3).toEqual('MainNet');
    const network4 = (APIService as any).validNetwork('xyz');
    expect(network4).toEqual('MainNet');
    const network5 = (APIService as any).validNetwork('mainnet');
    expect(network5).toEqual('MainNet');
    const network6 = (APIService as any).validNetwork('MainNet');
    expect(network6).toEqual('MainNet');
    const network7 = (APIService as any).validNetwork('testnet');
    expect(network7).toEqual('MainNet');
    const network8 = (APIService as any).validNetwork('TestNet');
    expect(network8).toEqual('TestNet');
  });
});
