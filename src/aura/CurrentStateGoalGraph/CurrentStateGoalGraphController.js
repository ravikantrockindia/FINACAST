({
	//4. Goal Forecast Tab
    goalForecast : function(component, event, helper) { 
           
        helper.showGoalForecast(component);
    },
    openHelpBox:function(component,event,helper){
        component.set("v.helpBox",true);
    },
    
    closeHelpBox:function(component,event,helper){
        component.set("v.helpBox",false);        
    },
})({
	myAction : function(component, event, helper) {
		
	}
})