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
    sectionsix : function(component, event, helper) {
        helper.helperFun(component,event,'articlesix');
    },
    
    sectionseven : function(component, event, helper) {
        helper.helperFun(component,event,'articleseven');
    },
    
    sectioneight : function(component, event, helper) {
        helper.helperFun(component,event,'articleeight');
    },
    
    
    hideSubTab : function(component, event, helper){
        helper.renderSubtabsOfSubtabs(component,'articleSubTab1');
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
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:transactionHistory",
            componentAttributes: {
                cid : Id
            }
        });
        evt.fire();
        
    },
    ClientInformHandler: function(component,event,helper){
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef:"c:MyClients",
            componentAttributes: {
                cid : Id,
                namespace : namespace
            }
        });
        evt.fire();
    },
    BudgetHandler: function(component,event,helper){
        
        var Id= component.get("v.ccid");
        var namespace= component.get("v.namespace");
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
    }
    
})