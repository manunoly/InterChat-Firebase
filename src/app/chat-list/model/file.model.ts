import { Entry } from '@ionic-native/File/ngx';

export interface iFile {
    name?: string, 
    type?: string,
    path?: string, 
    filePath?: string,
    extension?: string,
    mimeType?: string;
    fileEntry?: Entry; //For Local Purpose
}

export interface iFileUpload {
    ok:boolean  
    fileURL? : string, 
    fileName?: string,
    error?: any
}
