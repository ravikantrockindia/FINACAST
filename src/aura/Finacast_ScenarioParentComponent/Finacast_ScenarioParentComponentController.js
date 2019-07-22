({
    doInit : function(component, event, helper) {
        
        const defaultData = {"debugObj":[],"offset":2019,"debtAnalysis":{ "debtPayed": [], "debtItems": 0},"financialHealthAnalysis":[{},{}],"yearlySavings":[],"monthlySavingsTrack":[],"years":0,"goalAnalysis":{},"netWorthAnalysis":{},"monthOffset":{}};
        component.set("v.data2", defaultData); 
        component.set("v.data1", defaultData); 
    },
    
    handleActive: function(component, event, helper){
        component.set("v.Spinner", true);
        console.log('Inside compare');
        console.log('data 1: '+ JSON.stringify(component.get("v.data1")));
        console.log('data 2: '+ JSON.stringify(component.get("v.data2")));
        
        component.set("v.data2", component.get("v.data2"));
        //component.set("v.data1", component.get("v.data1"));
        
        var action = component.get("c.getData");  
        action.setParams({
            cid: component.get("v.cid")
        });
        action.setCallback(this, function(response) {
            console.log(response.getState());
            try{
                component.set("v.data1", JSON.parse(response.getReturnValue().response));
                console.log("response: " + response.getReturnValue().response);
            }
            catch(e){
                console.log('Error');
            }
            component.set("v.data2", component.get("v.data2"));
            component.set("v.Spinner", false);
        });
        $A.enqueueAction(action);
        
    },
    
	// this function automatic call by aura:waiting event  
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    
    // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){   
        component.set("v.Spinner", false);
    }
    
})