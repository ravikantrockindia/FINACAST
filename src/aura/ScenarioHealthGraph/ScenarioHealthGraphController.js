({
    
    finHealth : function(component, event, helper) {         
        if(!$A.util.isUndefinedOrNull(component.get("v.client"))){
            component.set("v.selectedClient",component.get("v.client").Id);
        }
        
        helper.showFinHealth(component);
        
        
    },
    showYearlyScoreNext:function(component,event,helper){
        helper.showNextYearlyScore(component);
    },
    
    showYearlyScorePrev:function(component,event,helper){
        helper.showPrevYearlyScore(component);
    },
    
    openHelpBox:function(component,event,helper){
        component.set("v.helpBox",true);
    },
    closeHelpBox:function(component,event,helper){
        component.set("v.helpBox",false);
    },
    
})