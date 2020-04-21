import { Injectable, OnInit } from '@angular/core';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { MediaCapture, MediaFile, CaptureError } from '@ionic-native/media-capture/ngx';
import { File, Entry, FileEntry } from '@ionic-native/file/ngx';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { Platform } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from '@ionic/storage';
import { iFile, iFileUpload } from '../chat-list/model/file.model';
import { UtilService } from './util.service';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';


const MEDIA_FOLDER_NAME = 'chatDemo_Media';
const STORAGE_KEY = 'my_files';

@Injectable({
  providedIn: 'root'
})
export class ManageAttachFilesService implements OnInit {

  files = [];

  public uploadProgress = 0;

  constructor(private storage: Storage,
    private utilService: UtilService,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private mediaCapture: MediaCapture,
    private file: File,
    private media: Media,
    private plt: Platform,
    private webView: WebView,
    private fireStorage: AngularFireStorage) {

  }

  ngOnInit() {
    this.plt.ready().then(() => {
      console.log('Platform Ready Checking Media Folder...');
      let path = this.file.dataDirectory;
      console.log(path);

      if (this.utilService.isCordova()) {
        this.file.checkDir(path, MEDIA_FOLDER_NAME).then(() => {
          this.loadStoredFiles();
        }, err => {
          this.file.createDir(path, MEDIA_FOLDER_NAME, false).then(() => {
            this.loadStoredFiles();
          })
        });
      }

    });
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
      const results = await this.imagePicker.getPictures({ maximumImagesCount: 1, quality: 40 });
      console.log('Picked Images ', results);

      if(results.length > 0){
        const fileResult = await this.copyFileToLocalDir(results[0]);
        return fileResult;
      }     

    }
    catch (error) {
      console.log('========error Pick Images========');
      console.log(error);
    }
  }

  private async capturePhoto() {
    try {

      const options: CameraOptions = {
        quality: 40,
        saveToPhotoAlbum: false,
        correctOrientation: true,
        encodingType: this.camera.EncodingType.JPEG,
      }

      const photoPath = await this.camera.getPicture(options);

      console.log(photoPath);
      const fileResult = await this.copyFileToLocalDir(photoPath);
      return fileResult;

    }
    catch (error) {
      console.log('========error Capture Photo========');
      console.log(error);
    }
  }

  //======================================================
  //======================================================
  //===================FIREBASE STORAGE===================
  //======================================================
  //======================================================


  /** FIRE STOREGA UPLOAD
   * 
   * 
   */
  async uploadFile(file: Entry) {

    console.log(file);
    const path = file.nativeURL.substr(0, file.nativeURL.lastIndexOf('/') + 1);
    console.log(path);

    let buffer: ArrayBuffer;
    try {

      buffer = await this.file.readAsArrayBuffer(path, file.name);

    } catch (error) {
      console.log('Error Read as a bufferArray');
      console.log(error);
      return;
    }

    /**
     * FIXME: pensar que hacemos con el tamaño, seria triste yo hiciera un video y me digan que es muy grande, dejemos esto para derpues para darle algo de mente. por ahora las fotos no debe ser problema
     * Propiedades
      Blob.size Read only
      El tamaño, en bytes,  de los datos contenidos en el objeto Blob
      Blob.type Read only
      Una cadena (String) indicando el tipo MIME de los datos contenidos en el Blob. Si el tipo es desconocido, esta cadena será vacía.
      https://developer.mozilla.org/es/docs/Web/API/Blob
     */

    const type = this.getMimeType(file.name.split('.').pop());
    const fileBlob = new Blob([buffer], type);
    const randomId = Math.random().toString(36).substring(2, 8);

    // FIRESTORE LOGIC
    const uploadTask = this.fireStorage.upload(`files/${randomId}_${file.name}`, fileBlob);

    uploadTask.percentageChanges().subscribe(changes => {
      console.log('========Uploading File========')
      console.log(changes);
      this.uploadProgress = changes * 0.01;
    });

    // RETURNIG PROMISE
    return new Promise<iFileUpload>((resolve, reject) => {

      uploadTask.then(async res => {

        console.log(res);
        console.log('========File Upload Finished!========');
        this.uploadProgress = 0;

        const fileURL = await res.ref.getDownloadURL();
        const fileName = res.ref.name;

        resolve({ ok: true, fileURL, fileName })
      },
        (error) => {
          console.log(error);
          console.log('========problem uploading file========');
          reject({ ok: false, error });
        })


    })

  }

  //======================================================
  //======================================================
  //======================================================
  //======================================================
  //======================================================

  /**
   * 
   * @param filePath 
   * @returns iFile
   */
  resolveFileFromFullPath(filePath: string): iFile {

    let myPath = filePath;
    // Make sure we copy from the right location
    if (filePath.indexOf('file://') < 0) {
      myPath = 'file://' + filePath;
    }

    const extension = myPath.split('.').pop() as string;
    const name = myPath.substr(myPath.lastIndexOf('/') + 1);
    const mimeType = this.getMimeType(extension).type
    const path = this.pathForFile(filePath);

    return { name, extension, mimeType, filePath, path }
  }

  private async copyFileToLocalDir(fullPath) {
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


    try {
      const fileEntry = await this.file.copyFile(copyFrom, name, copyTo, newName);
      console.log(fileEntry);
      this.updateStoredFiles(newName);

      return {
        name: newName,
        type: this.getMimeType(fileExtension).messageType,
        extension: fileExtension,
        filePath: this.file.dataDirectory + MEDIA_FOLDER_NAME + '/' + newName,
        path: this.pathForFile(this.file.dataDirectory + MEDIA_FOLDER_NAME + '/' + newName),
        mimeType: this.getMimeType(fileExtension).type,
        fileEntry: fileEntry
      } as iFile;

    } catch (error) {
      console.log('error Copy file to App Folder')
      console.log(error);

    }


  }

  pathForFile(file): string | null {
    if (file === null) {
      return null;
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
    return this.utilService.getMimeType(fileExt);
  }

  private loadFiles() {
    this.file.listDir(this.file.dataDirectory, MEDIA_FOLDER_NAME).then(res => {
      // this.files = res;
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
