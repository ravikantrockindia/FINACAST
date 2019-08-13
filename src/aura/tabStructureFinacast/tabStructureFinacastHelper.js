({
    helperFun: function(component, event, secId,flagelement) {console.log('flag',flagelement);
        var btnIds = ['articleOne', 'articleTwo', 'articleThree', 'articleFour', 'articleFive', 'articleSix', 'articleSeven', 'articleEight', 'articleNine', 'articleTen', 'articleEleven', 'articleSubTab1', 'articleSubTab2'];
                                                              
        var t = 0;
        for (var i = 0; i < btnIds.length; i++) {
            var btnId = btnIds[i];
            var btnCmp = component.find(btnId);
            var acc = component.find(secId);
            if (secId == 'articleSubTab1') {
                t = 1;
            }
            if ((btnId === secId)) {               
                for (var cmp in acc) {
                    $A.util.addClass(acc[cmp], 'slds-is-active');
                    if ($A.util.hasClass(acc[cmp], 'slds-tabs_scoped__content')) {
                        $A.util.toggleClass(acc[cmp], 'slds-show');
                        $A.util.toggleClass(acc[cmp], 'slds-hide');                      
                    }
                }
            } else {
                if (t == 1) {
                    if (btnId != 'articleTen') {
                        for (var cmp1 in btnCmp) {
                            $A.util.removeClass(btnCmp[cmp1], 'slds-is-active');
                            if ($A.util.hasClass(btnCmp[cmp1], 'slds-tabs_scoped__content')) {
                                $A.util.removeClass(btnCmp[cmp1], 'slds-show');
                                $A.util.addClass(btnCmp[cmp1], 'slds-hide');
                            }
                        }
                    }
                }

                else {
                    for (var cmp1 in btnCmp) {
                        $A.util.removeClass(btnCmp[cmp1], 'slds-is-active');
                        if ($A.util.hasClass(btnCmp[cmp1], 'slds-tabs_scoped__content')) {
                            $A.util.removeClass(btnCmp[cmp1], 'slds-show');
                            $A.util.addClass(btnCmp[cmp1], 'slds-hide');
                        }
                    }
                }
            }
        }
                
       

       window.setTimeout(
          $A.getCallback(function() {       
           var cmps = component.find(secId);
            //  alert('I am working');
            for (var cm in cmps) {
                if ($A.util.hasClass(cmps[cm], 'slds-tabs_scoped__content')) {
                    $A.util.removeClass(cmps[cm], 'slds-show');
                    $A.util.removeClass(cmps[cm], 'slds-is-active');
                    $A.util.addClass(cmps[cm], 'slds-hide');
                }
            }
        }),5000);
       },
       
        
   
    renderRelatedList: function(component, event, res, res2, fld1, articleName) {
        var comp = component.find(articleName);
        for (var cm in comp) {
            if ($A.util.hasClass(comp[cm], 'slds-tabs_scoped__content')) {
                $A.util.removeClass(comp[cm], 'slds-show');
                $A.util.removeClass(comp[cm], 'slds-is-active');
                $A.util.addClass(comp[cm], 'slds-hide');
            }
        }
       
        var evt = $A.get("e.Elixir_SC:result");
        evt.setParams({
            "sobj": res,
            "recdtype": res2,
            "patId": component.get("v.recordId"),
            "fld1": fld1
        },500);
        evt.fire();
    },
    

    getLabResults: function(component, event, articleName, resultName) {
        var comp = component.find(articleName);
        for (var cm in comp) {
            if ($A.util.hasClass(comp[cm], 'slds-tabs_scoped__content')) {
                $A.util.removeClass(comp[cm], 'slds-show');
                $A.util.removeClass(comp[cm], 'slds-is-active');
                $A.util.addClass(comp[cm], 'slds-hide');
            }
        }
        //  boolean open= true;
        var evt = $A.get("e.Elixir_SC:labOtherTestEvent");
        var open = new Boolean(1);
        evt.setParams({
            "isOpen": open,
            "resultName": resultName,
        });
        evt.fire();
    },
    renderSubtabsOfSubtabs: function(component, articleName, dctransfertype) {
        var comp = component.find(articleName);
        for (var cm in comp) {
            if ($A.util.hasClass(comp[cm], 'slds-tabs_scoped__content')) {
                $A.util.removeClass(comp[cm], 'slds-show');
                $A.util.removeClass(comp[cm], 'slds-is-active');
                $A.util.addClass(comp[cm], 'slds-hide');
            }
        }
        if (dctransfertype == 'DcPatient') {
            var evt = $A.get("e.Elixir_SC:dcPatient");
            var open = new Boolean(1);
            evt.setParams({
                "isOpen": open,
            });
            evt.fire();
        }
        if (dctransfertype == 'uploadForms') {
            var evt = $A.get("e.Elixir_SC:labOtherTestEvent");
            var open = new Boolean(1);
            evt.setParams({
                "isOpen": open,
                "resultName": 'Uploaded Signed Forms',
            });
            evt.fire();
        }
    },
    redirectToSobject: function(component, event, helper) {
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": component.get("v.recordId")
        });
        navEvt.fire();
    }
})