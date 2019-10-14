({
    doInit : function(component, event, helper) {
        console.log('namespace', component.get("v.namespace"))
        const defaultData = {"debugObj":[],"offset":2019,"debtAnalysis":{ "debtPayed": [], "debtItems": 0},"financialHealthAnalysis":[{},{}],"yearlySavings":[],"monthlySavingsTrack":[],"years":0,"goalAnalysis":{},"netWorthAnalysis":{},"monthOffset":{}};
        component.set("v.data2", defaultData); 
        component.set("v.data1", defaultData); 
        
                var action = component.get("c.ScenarioData");  
         action.setParams({
            clientId: component.get("v.cid")
        });
        
        action.setCallback(this, function(response) {
            
            component.set("v.scenario", response.getReturnValue());
           //alert(JSON.stringify(response.getReturnValue()));
             //alert('jj'+ component.get("v.scenario.id"));
            // alert('ddd'+response.getReturnValue().length);
            if(response.getReturnValue().length == 0){
                 component.set("v.kk", false);
            }
            else{
                 component.set("v.kk", true);
            }
         
        });
     
        $A.enqueueAction(action);
      
    },
    graphdata : function(component, event, helper) {
         var showGraph =event.getParam("showGraph");
        console.log("kkk"+showGraph);
        component.set("v.kk", true); 
        //alert( component.get("v.kk"));
      
    }
    ,
    onScenarioDeleteIcon: function(component, event, helper){
        var recordId = event.getSource().get('v.value');
         var action = component.get("c.deleteScenario");

        action.setParams({
            'ScenarioId' :event.getSource().get("v.value")
        });
        
        action.setCallback(this, function(response) {     
            var resultsToast = $A.get("e.force:showToast");
            resultsToast.setParams({
                "title": "Delete Success!",
                type: 'success',
                "message": "Record has been deleted successfully"           
            });
            resultsToast.fire();
             helper.helperMethod(component);
        });     
        $A.enqueueAction(action);   
    },
    onScenarioEditIcon: function(component, event, helper){
        var recordId = event.getSource().get('v.value');
       // alert(recordId);
       component.set("v.scenarioId",recordId);
        component.set("v.EditScenario",true);
    },
    
    handleManaged: function(component, event, helper){
        component.set("v.Spinner", true);
        var action = component.get("c.ScenarioData");  
         action.setParams({
            clientId: component.get("v.cid")
        });
        action.setCallback(this, function(response) {
            
            component.set("v.scenario", response.getReturnValue());
            component.set("v.Spinner", false);
             
        });
      
        $A.enqueueAction(action);
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
    cancelButton : function(component,event) {
        // component.set("v.recordName", "");
        // component.set("v.goalButtonStatus",false);
        // component.set("v.savingButtonStatus",false);
        // component.set("v.debtButtonStatus",false);  
        component.set("v.manageScenarioStatus", false);
    },
    
    onDoneScenarioButton : function(component) {
        component.set("v.manageScenarioStatus", false);
        
       // $A.get('e.force:refreshView').fire();
        component.set("v.noData", true);
    },
    
    onScenarioAddButton : function(component) {
        component.set("v.addScenarioButtonStatus", true);
        component.set("v.isAddScenarioActive", false);			//to disable add another scenario button and after click save icon enable it 
    },
    onNewScenarioSaveSuccess : function(component, event, helper) {
        console.log('Scenario Saving');
        if(($A.util.isUndefinedOrNull(component.find("sceneName").get("v.value"))) != true && component.find("sceneName").get("v.value") !="" )
        {
            var action = component.get("c.saveNewScenario");
            action.setParams({
                name : component.find("sceneName").get("v.value"),
                clientId : component.get("v.cid"),
            });
            
            action.setCallback(this, function(response){ 
                console.log('resonse after save: ' + JSON.stringify(response.getReturnValue()));
                var state = response.getState();
                if(state == 'SUCCESS'){
                    component.set("v.addScenarioButtonStatus", false);
                    component.set("v.isAddScenarioActive", true);
                                        
                    component.set("v.scenario", response.getReturnValue());
                    component.set("v.scene",component.get("v.scenario[0].Id"));
                    // helper.showFieldsValue(component);
                }
                else{
                    console.log('failed');
                }
                  
                 helper.helperMethod(component);
            });
            $A.enqueueAction(action);
        }   
    },
    
	// this function automatic call by aura:waiting event  
    showSpinner: function(component, event, helper) {
        component.set("v.Spinner", true); 
    },
    manageScenarioButton : function(component, event, helper) {     
        //var action = component.get("c.getUserScenarios");
        component.set("v.manageScenarioStatus", true);
        component.set("v.isAddScenarioActive", true); 
    },
    // this function automatic call by aura:doneWaiting event 
    hideSpinner : function(component,event,helper){   
        component.set("v.Spinner", false);
    }
    
})