({
    doInit : function(component, event, helper) {               
        var jsonResponseJs;  
        var a= component.get("v.ids");
         
        var action = component.get("c.getData");
        action.setParams({
            id: component.get('v.recordId')
        });
        action.setCallback(this, function(response){
            try{
                var g = response.getReturnValue();
                console.log('Response in Dashboard in init: ' + JSON.stringify(g));
                console.log("Name:" + g.firstClient);
                console.log(g.responseData);
                
                var state = response.getState();
                if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g))))  {
                    
                    //check for client
                    if(!($A.util.isUndefinedOrNull(g.firstClient))) {
                        component.set("v.client.Name", g.firstClient); 
                        component.set("v.selectedClient",g.clientid); 
                    }
                    
                    //set saving, credit, loan, networth
                    component.set('v.saving', g.financialAccountList['0']);
                    component.set('v.credit', g.financialAccountList['1']);
                    component.set('v.loan', g.financialAccountList['2']);
                    var netWorth = g.balanceList['0'] - (g.balanceList['1'] + g.balanceList['2']);
                    component.set('v.netWorth', netWorth);
                    
                }
                else {
                    alert("Create Data"); }
            } 
            //end set callback
            catch(e)
            {
                
            }
            
            
        });
         $A.enqueueAction(action); 
     },
    
    
    childComponentEvent : function(component, event) {
        console.log('dddhehdedhewbdhewdhedhed');
        console.log(JSON.stringify(event.getParam("idclient")));
        var id =event.getParam("idclient");
        component.set("v.ids", id);
        var a= component.get("v.ids");
        console.log('aaaaaaaaaaaaaaaa'+a);
        
        if(!$A.util.isEmpty(a))
        {
            var action = component.get("c.getData");
            console.log('client id: '+ a.Id); 
            action.setParams({
                id: a.toString()
            });
            action.setCallback(this, function(response) {
                try
                {
                    var g = response.getReturnValue();
                    console.log("Future Simulation Response on change client: " + JSON.stringify(g));
                    var state = response.getState();
                    
                    if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g)))) {
                        
                        //set loan, credit, saving, networth, goals
                        component.set('v.saving', g.financialAccountList['0']);
                        component.set('v.credit', g.financialAccountList['1']);
                        component.set('v.loan', g.financialAccountList['2']);
                        var netWorth = g.balanceList['0'] - (g.balanceList['1'] + g.balanceList['2']);
                        component.set('v.netWorth', netWorth);
                        
                        
                    }
                    else { helper.showToast(component, a.Name);} 
                }
                catch(e){
                    
                }
            })
            $A.enqueueAction(action);
        }
    },
    
    //change client method
    changeClient: function(component, event) {
        
        
        var jsonResponseJs;
        var selectedClient =   component.find("inf1").get("v.value")[0];
        if(!$A.util.isEmpty(selectedClient))
        {
            var action = component.get("c.getData");
            console.log('client id: '+ selectedClient.Id); 
            action.setParams({
                id: selectedClient.toString()
            });
            action.setCallback(this, function(response) {
                try
                {
                    var g = response.getReturnValue();
                    console.log("Future Simulation Response on change client: " + JSON.stringify(g));
                    var state = response.getState();
                    
                    if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g)))) {
                        
                        //set loan, credit, saving, networth, goals
                        component.set('v.saving', g.financialAccountList['0']);
                        component.set('v.credit', g.financialAccountList['1']);
                        component.set('v.loan', g.financialAccountList['2']);
                        var netWorth = g.balanceList['0'] - (g.balanceList['1'] + g.balanceList['2']);
                        component.set('v.netWorth', netWorth);
                        
                        
                    }
                    else { helper.showToast(component, selectedClient.Name);} 
                }
                catch(e){}
            })
            $A.enqueueAction(action);
        }
    },
    
    
    //for alert messages open and close
    showAlert: function(component, event, helper) {
        var flag = component.get('v.showAlert');
        if(flag){
            component.set("v.showAlert",false);}
        else{
            component.set("v.showAlert", true);}
    },
    handleSectionToggle: function (cmp, event) {
        var openSections = event.getParam('openSections');
        
        if (openSections.length === 0) {
            cmp.set('v.activeSectionsMessage', "All sections are closed");
        } else {
            cmp.set('v.activeSectionsMessage', "Open sections: " + openSections.join(', '));
        }
    },
    openModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        alert(component.get("v.recordId"))
        component.set("v.isModalOpen", true);
    },
    closeModel: function(component, event, helper) {
        // Set isModalOpen attribute to true
        component.set("v.isModalOpen", false);
    },
    handleAccount:function(component,event,helper){
          
        var ravi= event.getSource();
        var f=ravi.get("v.value");
       // var clientId=component.get('v.recordId');
        component.set("v.Tid",f);
         var x=component.get("v.Tid");
        console.log('value of X' +x);
        console.log("value of Financial Account"+f);
        var cmpEvent = component.getEvent("rTid");
        cmpEvent.setParams( { "eTid" :  x} );
        
        cmpEvent.fire();
        
    }   
})