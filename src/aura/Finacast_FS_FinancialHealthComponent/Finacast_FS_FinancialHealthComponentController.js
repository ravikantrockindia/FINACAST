({
	
    finHealth : function(component, event, helper) {         
        if(!$A.util.isUndefinedOrNull(component.get("v.client"))){
        component.set("v.selectedClient",component.get("v.client").Id);
        }
        
       /* var data = component.get("v.data");
        var obj = data.financialHealthAnalysis;
        var isEmpty = helper.emptyCheck(component, obj);
        if(isEmpty){
             component.set("v.isEmptyData", true);
        }
        else{
            component.set("v.isEmptyData", false);
             helper.showFinHealth(component);
        }
        */
        helper.showFinHealth(component);
       
        
    },
    
     //1.1 Next Year Financial Health Score
    showYearlyScoreNext:function(component,event,helper){
        helper.showNextYearlyScore(component);
    },
    
    //1.2 Previous Year Financial Health Score
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