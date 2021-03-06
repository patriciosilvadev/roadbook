import { Component } from "@angular/core";
import {
  NavController,
  NavParams,
  ViewController,
  LoadingController,
  ToastController
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { BaseUI } from "../../common/baseui";
import { RestProvider } from "../../providers/rest/rest";

@Component({
  selector: "page-question",
  templateUrl: "question.html"
})
export class QuestionPage extends BaseUI {
  title: string;
  content: string;
  errorMessage: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public storage: Storage,
    public longdingCtrl: LoadingController,
    public rest: RestProvider,
    public toastCtrl: ToastController
  ) {
    super();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad QuestionPage");
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  submitQuestion() {
    this.storage.get("UserId").then(val => {
      if (val != null) {
        let loading = super.showLoading(this.longdingCtrl, "Uploading...");
        loading.present();
        this.rest.saveQuestion(val, this.title, this.content).subscribe(
          f => {
            if (f["Status"] == "OK") {
              if(loading){
                loading.dismissAll();
                loading=null;
              }
              this.dismiss();
            } else {
              if(loading){
                loading.dismissAll();
                loading=null;
              }
              super.showToast(this.toastCtrl, f["StatusContent"]);
            }
          },
          error => (this.errorMessage = <any>error)
        );
      } else {
        super.showToast(this.toastCtrl, "Please login to ask question");
      }
    });
  }
}
