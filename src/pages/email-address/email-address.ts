import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CreatePasswordPage } from '../create-password/create-password';
import { InitDatabase } from '../../providers/init-database';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-email-address',
  templateUrl: 'email-address.html',
  providers: [InitDatabase]
})
export class EmailAddressPage {
  localdata = {};
  constructor(public navCtrl: NavController, private db: InitDatabase, public alertCtrl: AlertController) {
    this.loadData();
  }

  loadData() {
    let bridge = { 'localdata': this.localdata };
    this.db._db.transaction(function (tx) {
      tx.executeSql('SELECT email FROM profile WHERE id=1', [], function (tx, res) {
        var len = res.rows.length;
        for (var i = 0; i < len; i++) {
          bridge.localdata['email'] = res.rows.item(i).email;
        }
      }, function (e) {
      });
    });
  }

  replaceUndefined() {
    if (this.localdata['email'] == undefined || this.localdata['email'] == "") {
      this.doAlert("Missing e-mail");
      return 1;
    }
    var RegExp = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,24})$/;
    if(RegExp.exec(this.localdata['email']) == null){
      this.doAlert("Invalid e-mail");
      return 1;
    }
    return 0;
  }

  saveData() {    
    if(this.replaceUndefined() == 1){
      return;
    }
    let bridge = this.localdata;
    this.db._db.transaction(function (tx) {
      tx.executeSql('UPDATE profile SET email = ?', [
        bridge['email']
      ], function (tx, res) {
      }, function (e) {
        console.log(e.message + " Error updating the database " + e);
      });
    });
    this.navCtrl.push(CreatePasswordPage);
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
