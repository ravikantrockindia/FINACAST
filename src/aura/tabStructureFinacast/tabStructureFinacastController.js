({
    
    checkLicenseKey: function(component,event,helper){
        var licenseAction = component.get("c.checkEMRLicense");
        var is_license_available = false;
        licenseAction.setCallback(component,function(response){
            if(response.getState() === "SUCCESS"){
                is_license_available = response.getReturnValue();
                component.set("v.licenseAvailable",is_license_available);
            }
        });
        $A.enqueueAction(licenseAction);
    }, 
    notAccessible:function(component,event,helper){
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Insufficient Permissions",
            "type":"error",
            "message": "Your profile permissions does not allow you to access this tab!"
        });
        toastEvent.fire();
    },
    
    sectionOne: function(component, event, helper) {
        helper.helperFun(component,event,'articleOne');
    },
    sectionTwo : function(component, event, helper) {
        helper.helperFun(component,event,'articleTwo');
    },
    sectionThree : function(component, event, helper) {
        helper.helperFun(component,event,'articleThree');
    },
    sectionFour : function(component, event, helper) {
        helper.helperFun(component,event,'articleFour');
    },
    sectionFive : function(component, event, helper) {
        helper.helperFun(component,event,'articleFive');
    },
    
    
    nursingNotes: function(component,event, helper){
        helper.renderRelatedList(component,event,'Notes__c','Nursing Notes','Note__c','articleThree');
        helper.redirectToSobject(component, event, helper);
    },
    clinicalNotes :function (component,event,helper){
        helper.renderRelatedList(component,event,'Notes__c','Clinical Notes','Note__c','articleSix');
        helper.redirectToSobject(component, event, helper);
    },
    bioAssessments: function(component,event,helper){
        helper.renderRelatedList(component,event,'Assessments__c','Bio Psych Social','Description__c','articleSix');
        helper.redirectToSobject(component, event, helper);
    },
    caseMgmtNotes : function(component, event, helper){
        helper.renderRelatedList(component,event,'Notes__c','Case Management Notes','Note__c','articleSeven');
        helper.redirectToSobject(component, event, helper);
    },
    nursingAssessment :function(component, event, helper){
        helper.renderRelatedList(component,event,'Assessments__c','Nursing Assessment','Description__c','articleThree');
        helper.redirectToSobject(component, event, helper);
    },
    specialAssessments : function(component, event, helper){
        helper.renderRelatedList(component,event,'Assessments__c','Special Assessments','Description__c','articleSix');
        helper.redirectToSobject(component, event, helper);
    },
    treatmentPlan : function(component, event, helper){
        helper.renderRelatedList(component,event,'Plan__c','Initial Treatment Plan','Dummy_1__c','articleSix');
        helper.redirectToSobject(component, event, helper);
    },
    treatmentPlanReview : function(component, event, helper){
        helper.renderRelatedList(component,event,'Plan__c','Treatment Plan Reviews','Dummy_1__c','articleSix');
        helper.redirectToSobject(component, event, helper);
    },
    nursingTXPlan : function(component, event, helper){
        helper.renderRelatedList(component,event,'Plan__c','Nursing Tx Plan','Dummy_1__c','articleThree');
        helper.redirectToSobject(component, event, helper);
    },
    caseMgmtPlan : function(component, event, helper){
        helper.renderRelatedList(component,event,'Plan__c','Case Management Plan','Dummy_1__c','articleSeven');
        helper.redirectToSobject(component, event, helper);
    },
    HPassessments : function(component, event, helper){
        helper.renderRelatedList(component,event,'Assessments__c','H&P','Description__c','articleTwo');
        helper.redirectToSobject(component, event, helper);
    },
    caseMgmtAssmnt : function(component, event, helper){
        var flagelement = true;                                  //MINE
        component.set("v.flag",flagelement);
        
        helper.renderRelatedList(component,event,'Assessments__c','Case Management Assessment','Description__c','articleSeven');
        helper.redirectToSobject(component, event, helper);
        helper.helperFun(component,event,flagelement);
    },
    
    testcaseMgmtAssmnt : function(component, event, helper){
        //  alert('1');
        var flagelement = false;                                  //MINE
        component.set("v.flag",flagelement);
        
        helper.helperFun(component,event,flagelement);
        
    },
    
    
    
    labResults: function(component, event, helper){
        helper.getLabResults(component,event,'articleNine','Lab Result');
        helper.redirectToSobject(component, event, helper);
        
    },
    otherTestResults: function(component, event, helper){
        helper.getLabResults(component,event,'articleNine','Test Result');
        helper.redirectToSobject(component, event, helper);
    },
    
    
    DCTransferNote: function(component, event, helper){
        helper.renderRelatedList(component,event,'Notes__c','DC/Transfer Notes','Note__c','articleTen');
        helper.redirectToSobject(component, event, helper);
    },
    
    DCPatient: function(component, event, helper){
        var a = component.get('c.hideSubTab');
        $A.enqueueAction(a);
        helper.renderSubtabsOfSubtabs(component,'articleTen','DcPatient');
        helper.redirectToSobject(component, event, helper);
    },
    uploadForms:function(component, event, helper){
        helper.renderSubtabsOfSubtabs(component,'articleFour','uploadForms');
        
    },
    
    transferPatient: function(component, event, helper){
        var a = component.get('c.hideSubTab');
        $A.enqueueAction(a);
        helper.renderSubtabsOfSubtabs(component,'articleTen','transferPatient');
    },
    
    hideSubTab : function(component, event, helper){
        helper.renderSubtabsOfSubtabs(component,'articleSubTab1');
    },
    
    
    labTest:function(component, event, helper){
        helper.renderRelatedList(component,event,'Labs_and_RX_forms__c','Lab Testing','Test_Description__c','articleTwo');
        helper.redirectToSobject(component, event, helper);
    },
    toggleView:function(component, event, helper){
        var cmps = component.find("articleTwo");
        for(var cm in cmps){
            if($A.util.hasClass(cmps[cm],'slds-tabs_scoped__content')){
                $A.util.removeClass(cmps[cm], 'slds-show');
                $A.util.removeClass(cmps[cm], 'slds-is-active');
                $A.util.addClass(cmps[cm], 'slds-hide');
            }
        }
    },
    transactionHandler: function(component,event,helper){
           var Id= component.get("v.ccid");
        console.log('id--------------'+Id);
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:transactionHistory",
            componentAttributes: {
                cid : Id
            }
        });
        evt.fire();
        
    },
    BudgetHandler: function(component,event,helper){
     
        var Id= component.get("v.ccid");
         var namespace= component.get("v.namespace");
        console.log('id--------------'+namespace);
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Budget",
            componentAttributes: {
                cid : Id,
                 namespace : namespace
            }
        });
        evt.fire();
        
    },
    ScenarioHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Finacast_ScenarioParentComponent",
            componentAttributes: {
                 cid : Id,
                 namespace : namespace
            }
        });
        evt.fire();
    },
    GoalHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Goalfinal",
            componentAttributes: {
                 cid : Id,
                 namespace : namespace
            }
        });
        evt.fire();
    },
    AccountHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:AccountTabInReport",
            componentAttributes: {
                 cid : Id,
                 namespace : namespace
            }
        });
        evt.fire();
    },
    FutureHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Finacast_FS_ParentComponent",
            componentAttributes: {
                 cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
    },
     AffordHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
         var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:Affordability",
            componentAttributes: {
                 cid : Id,
                 namespace : namespace
            }
        });
        evt.fire();
    },
  
    childComponentEvent: function(component,event,helper){
     var id =event.getParam("idclient");
        component.set("v.ccid ", id);
     var namespace = event.getParam("NameSpace");   
        component.set("v.namespace ", namespace);
        console.log('iiiiiiddddd'+id);
    }
    
})