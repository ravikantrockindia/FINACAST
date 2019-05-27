({
	myAction : function(component, event, helper) {
		
	},
    calculationRisk:function(component,event,helper){
       // alert('hello')
        component.set("v.showResult",true);
        var action = component.get("c.updateInvestmentAccount");  
            action.setParams({
                riskResult:'Very Aggressive'
            })
                            $A.enqueueAction(action);

            
           // window.onclick=myfunction;
    },
    closePopup:function(component,event,helper){
                component.set("v.showResult",false);

    }
})