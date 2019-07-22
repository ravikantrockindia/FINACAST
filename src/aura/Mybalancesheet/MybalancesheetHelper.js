({
    changeClient: function(component, event) {
        
        
        var jsonResponseJs;
        var selectedClient =   component.find("inf1").get("v.value")[0];
        //component.set("v.client", selectedClient); 
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
})