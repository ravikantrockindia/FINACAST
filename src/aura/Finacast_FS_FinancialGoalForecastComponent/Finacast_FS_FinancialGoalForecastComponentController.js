({
	//4. Goal Forecast Tab
    goalForecast : function(component, event, helper) { 
        /*var data = component.get("v.data");
        var obj = data.goalAnalysis;
        var isEmpty = helper.emptyCheck(component, obj);
        if(isEmpty){
             component.set("v.isEmptyData", true);
        }
        else{
            component.set("v.isEmptyData", false);
             helper.showGoalForecast(component);
        }*/
        
        helper.showGoalForecast(component);
    },
    openHelpBox:function(component,event,helper){
        component.set("v.helpBox",true);
    },
    
    closeHelpBox:function(component,event,helper){
        component.set("v.helpBox",false);        
    },
})