({
	//2. Debt Forecast 
    debtForecast : function(component, event, helper){
        var data = component.get("v.data");
        /*if(!$A.util.isUndefinedOrNull(data.debtAnalysis)){
        var obj = data.debtAnalysis;
        var isEmpty = helper.emptyCheck(component, obj);
        if(isEmpty){
             component.set("v.isEmptyData", true);
        }
        else{
            component.set("v.isEmptyData", false);
             helper.showDebtForecast(component);
        }
        }*/
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
    openSeeHow:function(component,event,helper){
        var data=new Object();
        component.set('v.defaultAlertData',data);
        component.set('v.interestAlertData',data);
        //console.log('open See How');
        component.set("v.seeHowBox",true);
        var type=event.target.id;
        if(type=='default'){
            helper.showDefaultAlertTable(component,event);
        }
        else if(type='interest'){
            helper.showInterestAlertTable(component,event);
            
        }
    },
    
    closeSeeHow:function(component,event,helper){
        component.set("v.seeHowBox",false);
    },
})