/*
 * created by : avneet kaur
**/

({
    doInit : function(component,event, helper) {
        console.log('Inside ScenarioContainerComponent')
        component.set('v.tabSelected', 'scenario');
        helper.initialData(component);
    },
    
    /***
     * to change client
     * calls the child component to set the valuue of income, goal,expense,loan,credit card, savings
     * **/
    
    changeClientButton : function(component,event, helper) {     
        helper.changeClientData(component);   
    },
    
    //on changing tab
    
    tabSelected :function(component,event,helper) {
        console.log('tab selected');
        component.set("v.client.Id",'init');
        helper.initialData(component);
    },
    
    scenarioTab :function(component) { 
        component.set('v.tabSelected', 'scenario');
        console.log('client scenario' ,component.get("v.client"));
        
    },
    currentStateTab :function(component) { 
        component.set('v.tabSelected', 'current state');
    },
    /*** 
     * get all scenario list
     * add scenario
     * delete scenario
     ***/
    
    manageScenarioButton : function(component, event, helper) {     
        var action = component.get("c.getUserScenarios");
        component.set("v.manageScenarioStatus", true);
        component.set("v.isAddScenarioActive", true); 
    },
    
    
    hideExampleModal : function(component, event, helper) {
        helper.hideExampleModal(component);
    },
    
    
    showExampleModal : function(component, event, helper) {
        helper.showExampleModal(component);
    },
    
    
    /***
     * delete scenario on scenario manage popup
     * called when delete icon is clicked
     * **/
    
    onScenarioDeleteIcon : function(component,event) {
        var sId = event.getSource().get("v.value");
        var action = component.get("c.deleteRecord");
        action.setParams({
            clientId : component.get("v.client.Id"),
            recId : sId,
            recType : 'scenario'
        });
        
        action.setCallback(this, function(response){
            component.set("v.scenario", response.getReturnValue());
        });
        $A.enqueueAction(action);
    },
    
    /***
     * to add new scenarios
     * called when save icon(present on manage scenario popup) is clicked
     * **/
    
    onScenarioSaveIcon : function(component) {
        if(($A.util.isUndefinedOrNull(component.find("sceneName").get("v.value"))) != true && component.find("sceneName").get("v.value") !="" )
        {
            var action = component.get("c.saveRecord");
            action.setParams({
                recName : component.find("sceneName").get("v.value"),
                clientId : component.get("v.client.Id"),
                recType : 'scenario'
            });
            
            action.setCallback(this, function(response){
                component.set("v.addScenarioButtonStatus", false);
                component.set("v.isAddScenarioActive", true);
                component.set("v.scenario", response.getReturnValue());
                component.set("v.sceneId",component.get("v.scenario[0].Id"));
            });
            $A.enqueueAction(action);
        }   
    },
    
    /***
    * called when add another scenario button is clicked
    * **/
    
    onScenarioAddButton : function(component) {
        component.set("v.addScenarioButtonStatus", true);
        component.set("v.isAddScenarioActive", false);			//to disable add another scenario button and after click save icon enable it 
    },
    changeClientName :function(component,event,helper){
        console.log(component.find("inf1").get("v.value"));
    },

    /***
     * close manage scenario popup
     * **/
    
    onDoneScenarioButton : function(component) {
        component.set("v.manageScenarioStatus", false);
        component.set("v.parentInitialize", true);
        component.find("child").changeFieldsValue(component.get("v.client"),component.get("v.sceneID"));
    },
    
    onClickChangeScenario : function(component) {
        component.set("v.sceneID",component.find('scenarioList').get("v.value"));
        component.set("v.parentInitialize", true);
        if(component.get("v.tabSelected") == "scenario") {
            component.find("child").changeFieldsValue(component.get("v.client"),component.get("v.sceneID"));
        }
        if(component.get("v.tabSelected") == "current state") {
            component.find("currentStateScenario").changeClient(component.get("v.client"),component.get("v.sceneID"));
        }
    },
    changeClientDatascenario : function(component,event,helper) {
         
            component.find("currentStateScenario").changeClient(component.get("v.client"),component.get("v.sceneID"));
        console.log(component.get("v.changeData"));
        
    }
})