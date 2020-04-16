import { Injectable, OnInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { iFile } from '../chat-list/model/file.model';
import { UtilService } from './util.service';


const MEDIA_FOLDER_NAME = 'chatDemo_Media';
const STORAGE_KEY = 'my_files';

@Injectable({
  providedIn: 'root'
})
export class ManageAttachFilesService implements OnInit {

  files = [];

  constructor(private storage: Storage,
    private utilService: UtilService,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media,
    private plt: Platform,
    private webView: WebView) {

  }

  ngOnInit() {
    this.plt.ready().then(() => {
      console.log('Platform Ready Checking Media Folder...');
      let path = this.file.dataDirectory;
      console.log(path);

      this.file.checkDir(path, MEDIA_FOLDER_NAME).then(() => {
        this.loadStoredFiles();
      }, err => {
        this.file.createDir(path, MEDIA_FOLDER_NAME, false).then(() => {
          this.loadStoredFiles();
        })
      });
    })
  }

  /**
   * 
   * @param type 'camera' | 'gallery'
   */
  selectAttachAction(type: string) {

    switch (type) {
      case 'camera':
        return this.capturePhoto();
        break;

      case 'gallery':
        return this.pickImages();
        break

      default:
        break;
    }
  }

  private async pickImages() {
    try {
      const results = await this.imagePicker.getPictures({ maximumImagesCount: 1 });
      console.log('Image ===> ');
      console.log(results);
      const fileResult = this.copyFileToLocalDir(results[0]);
      return fileResult;

    }
    catch (error) {
      console.log('========error Pick Images========');
      console.log(error);
    }
  }

  private async capturePhoto() {
    try {
      const data = await this.mediaCapture.captureImage() as MediaFile[];
      if (data.length > 0) {
        console.log('Result => ');
        console.log(data[0].fullPath);
        const fileResult = this.copyFileToLocalDir(data[0].fullPath);
        return fileResult;
      }
    }
    catch (error) {
      console.log('========error Capture Photo========');
      console.log(error);
    }
  }

  /**
   * 
   * @param filePath 
   * @returns iFile
   */
  resolveFileFromFullPath(filePath : string) : iFile{

    let myPath = filePath;
    // Make sure we copy from the right location
    if (filePath.indexOf('file://') < 0) {
      myPath = 'file://' + filePath;
    }

    const type = myPath.split('.').pop() as string;
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const mimeType = this.getMimeType(type).type
    const path = this.pathForFile(filePath);

    return {name , type , mimeType , filePath , path }
  }

  private copyFileToLocalDir(fullPath) {
    console.log('copy now: ', fullPath);
    let myPath = fullPath;
    // Make sure we copy from the right location
    if (fullPath.indexOf('file://') < 0) {
      myPath = 'file://' + fullPath;
    }

    const fileExtension = myPath.split('.').pop() as string;
    const dateNow = Date.now();
    const newName = `${dateNow}.${fileExtension}`;

    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const copyFrom = myPath.substr(0, myPath.lastIndexOf('/') + 1);
    const copyTo = this.file.dataDirectory + MEDIA_FOLDER_NAME;

    this.file.copyFile(copyFrom, name, copyTo, newName).then(() => {
      // this.loadFiles();
      this.updateStoredFiles(newName);
    }, err => console.log('error: ', err));

    return {
      name: newName,
      type: fileExtension,
      filePath: fullPath,
      path: this.pathForFile(fullPath),
      mimeType: this.getMimeType(fileExtension).type
    } as iFile;

  }

  pathForFile(file) {
    if (file === null) {
      return '';
    } else {
      let converted = this.webView.convertFileSrc(file);
      return converted;
    }
  }

  private loadStoredFiles() {

    this.utilService.getUserFromStorage
    this.storage.get(STORAGE_KEY).then(files => {
      if (files) {
        let arr = JSON.parse(files);
        this.files = [];
        for (let file of arr) {
          let filePath = this.file.dataDirectory + file;
          let resPath = this.pathForFile(filePath);
          this.files.push({ name: file, path: resPath, filePath: filePath });
        }
        console.log(this.files);
      }
    });
  }

  private updateStoredFiles(name) {
    this.storage.get(STORAGE_KEY).then(images => {
      let arr = JSON.parse(images);
      if (!arr) {
        let newImages = [name];
        this.storage.set(STORAGE_KEY, JSON.stringify(newImages));
      } else {
        arr.push(name);
        this.storage.set(STORAGE_KEY, JSON.stringify(arr));
      }

      let filePath = this.file.dataDirectory + name;
      let resPath = this.pathForFile(filePath);

      let newEntry = {
        name: name,
        path: resPath,
        filePath: filePath
      };

      this.files = [newEntry, ...this.files];
      // this.detectorChangeRef.detectChanges(); // trigger change detection cycle
    });
  }

  private getMimeType(fileExt: string) {
    if (fileExt == 'wav') return { type: 'audio/wav' };
    else if (fileExt == 'jpg') return { type: 'image/jpg' };
    else if (fileExt == 'jpeg') return { type: 'image/jpeg' };
    else if (fileExt == 'png') return { type: 'image/png' };
    else if (fileExt == 'mp4') return { type: 'video/mp4' };
    else if (fileExt == 'MOV') return { type: 'video/quicktime' };
  }

  private loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(res => {
      this.files = res;
      console.log('files: ', res);
    });
  }

  private openFile(f: FileEntry) {
    if (f.name.indexOf('.wav') > -1) {
      // We need to remove file:/// from the path for the audio plugin to work

      // const path =  f.nativeURL.replace(/^file:\/\//, '');
      // const audioFile: MediaObject = this.media.create(path);
      // audioFile.play();

    } else if (f.name.indexOf('.MOV') > -1 || f.name.indexOf('.mp4') > -1) {

      // VIDEO



    } else if (f.name.indexOf('.jpg') > -1) {

      // IMAGE

      // this.photoViewer.show(f.nativeURL, 'MY awesome image');

    }
  }

  private deleteFile(f: FileEntry) {
    const path = f.nativeURL.substr(0, f.nativeURL.lastIndexOf('/') + 1);

    this.file.removeFile(path, f.name).then(() => {
      // this.loadFiles();
    }, err => console.log('error remove: ', err));
  }

}
