/* Developed by Aditya Kaushal
  CreatedDate: June 25'19
  Purpose : Makes a callout to the service and sets the data in child components. Acts as a container for 4 child cmps.
  */

({
    doInit : function(component, event, helper) {
        var workspaceAPI = component.find("workspace");
            var tab=component.get("v.tabName")
            console.log('tab',tab)
            workspaceAPI.getFocusedTabInfo().then(function(response) {
                var focusedTabId = response.tabId;
                console.log('tab id',focusedTabId )
                workspaceAPI.setTabLabel({
                    label: tab
                });
            })
            .catch(function(error) {
                console.log(error);
            });   
        
        component.set("v.Spinner", true);
        
        if(!$A.util.isUndefinedOrNull(component.get("v.recordId"))){
            //component.set("v.selectedClient",component.get("v.client").Id);
            component.set("v.selectedClient",component.get("v.recordId"));
        }
        
        const defaultData = {"debugObj":[],"offset":2019,"debtAnalysis":{ "debtPayed": [], "debtItems": 0}, "financialHealthAnalysis":[],"yearlySavings":[],"monthlySavingsTrack":[],"years":0, "goalAnalysis":{"goalItems": 0, "yearlyData":[]},"netWorthAnalysis":{},"monthOffset":{}};
        component.set("v.data",defaultData); 
        
        var action = component.get("c.getData");  
        action.setParams({
            clId: component.get("v.cid")
        });
        action.setCallback(this, function(response) {
            console.log(response.getState());
            console.log("response: " + JSON.stringify(response.getReturnValue().response));
            try{
                 component.set("v.data", JSON.parse(response.getReturnValue().response));
                //component.set("v.data", response.getReturnValue().response);
                console.log("response: " + JSON.stringify(response.getReturnValue().response));
            }
            catch(e){
                console.log('Error in Parent' +  e.message);
            }
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

    
/*    changeClient : function(component, event, helper) {
        var params = event.getParam('arguments');
        if(params) {
            component.set("v.client", params.clientId); 
            console.log('params (client) in future simulation: ', component.get("v.client"));
            helper.getUserData(component);
        }
    },
  */  
    /*loadClientFutureSim : function(component, event, helper) {
        var client= component.get("v.selectedClient");
        if(!$A.util.isEmpty(client) && !$A.util.isUndefined(client) && client!= ""){
            var action = component.get("c.getData");  
            action.setParams({
                clId:client.toString()
            });
            action.setCallback(this, function(response) {
                console.log(response.getState());
                try{
                    component.set("v.data", response.getReturnValue().response);
                    console.log("response: " + response.getReturnValue().response);
                }
                catch(e){
                    console.log('Error');
                }
            });
            $A.enqueueAction(action);   
        }//end if
    },*/