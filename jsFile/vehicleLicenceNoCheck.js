        var inputContent = this.inputBox.textView.text;
        if (inputContent.length > 7) {
            logger.D(TAG, "invalid input content: ", this.localization.settingPopupWarningMoreThan7Words);
            this.warningTxt.visible = true;
            this.warningTxt.text = this.localization.settingPopupWarningMoreThan7Words;
        } else if (inputContent.length < 7) {
            logger.D(TAG, "invalid input content: ", this.localization.settingPopupWarningLessThan7Words);
            this.warningTxt.visible = true;
            this.warningTxt.text = this.localization.settingPopupWarningLessThan7Words;
        } else if (inputContent.match(/^[\u4E00-\u9FA5][A-Z][0-9A-Z]{5}$/) !== null) {
            logger.D(TAG, "valid input content: ", inputContent);
            this.onHideAnim();
            setTimeout(function() {
                this.onPopupClosed({
                    popCloseType: "ok",
                    msg: (inputContent.slice(0, 2) + " " + inputContent.slice(2))
                });
            }.bind(this), 150);
        } else {
            logger.D(TAG, "invalid input content: ", inputContent.match(/[^0-9A-Z\u4E00-\u9FA5]/));
            this.warningTxt.visible = true;
            this.warningTxt.text = this.localization.settingPopupWarningCharacterType;
        }

        // (inputContent.match(/[^0-9A-Z\u4E00-\u9FA5]/) !== null) {
        //     logger.D(TAG, "invalid input content: ", inputContent.match(/[^0-9A-Z\u4E00-\u9FA5]/));
        //     this.warningTxt.visible = true;
        //     this.warningTxt.text = this.localization.settingPopupWarningCharacterType;
        // } else {
        //     logger.D(TAG, "valid input content: ", inputContent);
        //     this.onHideAnim();
        //     setTimeout(function() {
        //         this.onPopupClosed({
        //             popCloseType: "ok",
        //             msg: (inputContent.slice(0, 2) + " " + inputContent.slice(2))
        //         });
        //     }.bind(this), 150);