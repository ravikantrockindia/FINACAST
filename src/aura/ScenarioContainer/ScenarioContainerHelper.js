({
    hideExampleModal : function(component) {
        component.set("v.manageScenarioStatus", false);
    },
    
    initialData : function(component) {
        console.log('Inside Initial data');
        var action = component.get("c.getUserScenarios");
        action.setParams({
            clientId : "init",
            sceneId : "init"
        });
        
        action.setCallback(this, function(response){
            try{
                console.log(response.getReturnValue().userNameId)
            component.set("v.client", response.getReturnValue().userNameId);
                console.log('client id',component.get("v.client.Id"));
                console.log('resp: ',response.getReturnValue().userNameId.Id);
                console.log('resp: ',response.getReturnValue());
            component.set("v.scenario", response.getReturnValue().userScenario);
            if(!($A.util.isUndefinedOrNull(response.getReturnValue().userScenario))) {
                if($A.util.isUndefinedOrNull(response.getReturnValue().userScenario[0]) != true && response.getReturnValue().userScenario[0] != '') {
                    component.find('scenarioList').set('v.value',response.getReturnValue().userScenario[0].Id);
                    component.set('v.sceneID',component.find('scenarioList').get('v.value'));
                    component.set("v.parentInitialize", true);
                }
            }
            if(component.get("v.tabSelected") == "current state") {
                component.find("currentStateScenario").changeClient(response.getReturnValue().userNameId, response.getReturnValue().scenarioId);
                component.find("currentStateFutureSim").changeClient(component.get("v.client.Id"));
            }
            }
            catch(e)
            {
                console.log(e);
                var event = $A.get("e.force:showToast");
                                            event.setParams({
                                                "type" : "Warnning",
                                                "title" : "Info !",
                                                "message" : "No Data for client Available "
                                            });
                                            event.fire();
            }
        });
        $A.enqueueAction(action); 
    },
    
    changeClientData : function(component) {
        var selectedClient= component.find("inf1").get("v.value");
        component.set("v.client", selectedClient);
        var client= component.get("v.selectedClient");
        
        if(!$A.util.isEmpty(selectedClient))
        {
            var action = component.get("c.getUserScenarios");
            console.log('client id: '+ selectedClient); 
            action.setParams({
                clientId : selectedClient.toString(),
                sceneId : "init"
                
            });
            
            action.setCallback(this, function(response) {
                component.set("v.scenario", response.getReturnValue().userScenario);
                component.set("v.client",selectedClient);
                if(component.get("v.tabSelected") == "scenario") {
                    component.find("child").changeFieldsValue(response.getReturnValue().userNameId, response.getReturnValue().scenarioId);
                }
                if(component.get("v.tabSelected") == "current state") {
                    component.find("currentStateScenario").changeClient(response.getReturnValue().userNameId, response.getReturnValue().scenarioId);
                    component.find("currentStateFutureSim").changeClient(component.get("v.client.Id"));
                }
            });
            $A.enqueueAction(action); 
        }
    }
})