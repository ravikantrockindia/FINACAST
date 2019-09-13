({
	//2. Debt Forecast 
    debtForecast : function(component, event, helper){
        var data = component.get("v.data");
        helper.showDebtForecast(component);
    },
    
     debtForecast2 : function(component, event, helper){
        helper.showDebtForecast(component);
    },
    
    //2.1 Previous Year Data Interest
    showYearlyInterestPrev : function (component, event, helper){
        helper.prevYearlyInterest(component);     
    },
    
    //2.2 Next Year Data Interest
    showYearlyInterestNext : function (component, event, helper){
        helper.nextYearlyInterest(component);
    },
    
    //2.3 Debt Analysis Messages
    showDebtAnalysis: function(component, event, helper){
        helper.debtAnalysis(component);
    },
    
    openHelpBox:function(component,event,helper){
       // console.log("help");
        component.set("v.helpBox",true);
        //console.log(component.get("v.helpBox"));
    },
    
    closeHelpBox:function(component,event,helper){
       // console.log("close help box");
        component.set("v.helpBox",false);
        // component.get("v.seeHowBox",false);
        
    },

    
    closeSeeHow:function(component,event,helper){
        component.set("v.seeHowBox",false);
    },
})