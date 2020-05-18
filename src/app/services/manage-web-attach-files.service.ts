import { Injectable } from "@angular/core";

import { AngularFireStorage } from "@angular/fire/storage";
import { iFileUpload, iFile } from "../chat-list/model/file.model";
import { Observable } from 'rxjs';
import { UtilService } from './util.service';


@Injectable({
  providedIn: "root",
})
export class ManageWebAttachFilesService {
  uploadProgress: Observable<number>;

  constructor(
    private fireStorage: AngularFireStorage,
    private utilChatService: UtilService
  ) {}

  async uploadFile(file: File): Promise<iFileUpload> {
    
    if (this.utilChatService.imageMaxSize < file.size) {
      this.utilChatService.showAlert('Error','','Size exceeded!');
      return { ok: false };
    }
    
    let loading = await this.utilChatService.showLoading();
    
    const type = this.utilChatService.getMimeType(file.name.split(".").pop());
    
    console.log("archivo a subir", file);
    
    return new Promise<iFileUpload>((resolve, reject) => {
      const extension = file.name.split('.').pop() as string;
      const dateNow = new Date().getTime();
      const nameNow = `${dateNow}.${extension}`;
      const randomId = Math.random().toString(36).substring(2, 8);

      const uploadTask = this.fireStorage.upload(`files/${randomId}_${nameNow}`, file);

      // uploadTask
      //   .snapshotChanges()
      //   .pipe(
      //     finalize(() => {
      //       let downloadURL = fileRef.getDownloadURL();

      //       downloadURL.subscribe(url => {
      //         console.log(url);
      //         if (url) {
      //           resolve({ ok: true, url, randomId })
      //         }else{
      //           reject({ ok: false, Error });
      //         }
      //       });
      //     })
      //   )
      //   .subscribe(url => {
      //     if (url) {
      //       console.log(url);
      //     }
      //   });

      this.uploadProgress = uploadTask.percentageChanges();
      this.uploadProgress.subscribe(
        (percentage) => {
          console.log(percentage);
          loading.message = percentage.toFixed(2) + "% ...";
        },
        (err) => {
          loading.message = "Uploading error";
        }
      );

      uploadTask.then(
        async (res) => {
          console.log(res);
          console.log("========File Upload Finished!========");

          const fileURL = await res.ref.getDownloadURL();
          const fileName = res.ref.name;

          setTimeout(() => {
            this.utilChatService.dismissLoading();
          }, 100);

          resolve({ ok: true, fileURL, fileName });
        },
        (error) => {
          console.log(error);
          console.log("========problem uploading file========");

          setTimeout(() => {
            this.utilChatService.dismissLoading();
          }, 100);

          reject({ ok: false, error });
        }
      ).catch(error=>console.log(error));
    });
  }

  getIFileFromInput(file: File) : iFile{

    const extension = file.name.split('.').pop() as string;
    const dateNow = Date.now();
    const name = `${dateNow}.${extension}`;
    const mimeType = file.type;
    const type = this.utilChatService.getMimeType(extension).messageType;
    return {name, extension, type , mimeType}
  }
}
