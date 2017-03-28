import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NotificationsPromptPage } from '../notifications-prompt/notifications-prompt';
import { InitDatabase } from '../../providers/init-database';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-enter-birthday',
  templateUrl: 'enter-birthday.html',
  providers: [InitDatabase]
})
export class EnterBirthdayPage {
  localdata = {};
  constructor(public navCtrl: NavController, private db: InitDatabase, public alertCtrl: AlertController) {
    this.loadData();
  }

  loadData() {
    let bridge = { 'localdata': this.localdata };
    this.db._db.transaction(function (tx) {
      tx.executeSql('SELECT birthday FROM profile WHERE id=1', [], function (tx, res) {
        var len = res.rows.length;
        for (var i = 0; i < len; i++) {
          bridge.localdata['birthday'] = res.rows.item(i).birthday;
        }
      }, function (e) {
      });
    });
  }

  replaceUndefined() {
    if (this.localdata['birthday'] == undefined || this.localdata['birthday'] == "") {
      this.doAlert("Missing birthday")
      return 1;
    }
  }

  saveData() {
     if(this.replaceUndefined() == 1){
      return;
    }
    this.replaceUndefined();
    let bridge = this.localdata;
    this.db._db.transaction(function (tx) {
      tx.executeSql('UPDATE profile SET birthday = ?', [
        bridge['birthday']
      ], function (tx, res) {
      }, function (e) {
        console.log(e.message + " Error updating the database " + e);
      });
    });
    this.navCtrl.push(NotificationsPromptPage);
  }

  goBack() {
    this.navCtrl.pop();
  }

  doAlert(msg) {
    let alert = this.alertCtrl.create({
      title: 'Message',
      message: msg,
      buttons: ['Ok']
    });
    alert.present()
  }
}
