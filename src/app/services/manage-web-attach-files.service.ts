import { Injectable } from "@angular/core";

import { AngularFireStorage } from "@angular/fire/storage";
import { iFileUpload } from "../chat-list/model/file.model";
import { UtilService } from "./util.service";
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ManageWebAttachFilesService {
  uploadProgress;

  constructor(
    private fireStorage: AngularFireStorage,
    private utilService: UtilService
  ) {}

  async uploadFile(file: File): Promise<iFileUpload> {
    
    if (this.utilService.imageMaxSize < file.size) {
      this.utilService.showAlert('Error','','Size exceeded!');
      return { ok: false };
    }
    
    let loading = await this.utilService.showLoading();
    
    const type = this.utilService.getMimeType(file.name.split(".").pop());
    
    console.log("archivo a subir", file);
    
    return new Promise<iFileUpload>((resolve, reject) => {
      const randomId = Math.random().toString(36).substring(2, 8);

      const uploadTask = this.fireStorage.upload(`files/${randomId}`, file);

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
          loading.message = percentage + "% ...";
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
            this.utilService.dismissLoading();
          }, 100);

          resolve({ ok: true, fileURL, fileName });
        },
        (error) => {
          console.log(error);
          console.log("========problem uploading file========");

          setTimeout(() => {
            this.utilService.dismissLoading();
          }, 100);

          reject({ ok: false, error });
        }
      ).catch(error=>console.log(error));
    });
  }
}
