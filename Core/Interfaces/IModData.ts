import { IModFile } from './IModFile';

export interface IModData {
  Name: string;
  Hash: string;
  LoadOrder: number;
  BasePath: string;
  IsEnabled: boolean;
  Files: Array<IModFile>;
}
