({
    doInit : function(component, event, helper) {               
        var jsonResponseJs;  
        var action=component.get('c.getAccounts');
        action.setParams({
            ClientId: component.get('v.recordId')
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var data=response.getReturnValue();
                component.set("v.cash", data.cashAccountList);
                component.set("v.investment", data.investmentAccountList);
                component.set("v.credit", data.creditAccountList);
                component.set("v.loan", data.loanAccountList);
                component.set("v.cashvalue", data.cashAmount);
                component.set("v.investmentvalue",data.investmentAmount);
                component.set("v.loanvalue", data.loanAmount);
                component.set("v.creditvalue", data.creditAmount);
                var networth=data.cashAmount+data.investmentAmount - data.creditAmount -data.loanAmount;
                component.set("v.netWorth", networth);
                
                
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action); 
    },
    
    
    //change client method
    changeClient: function(component, event) {
        
        
        var jsonResponseJs;
        var selectedClient =   component.find("inf1").get("v.value")[0];
        if(!$A.util.isEmpty(selectedClient))
        {
            var action = component.get("c.getData");
            action.setParams({
                id: selectedClient.toString()
            });
            action.setCallback(this, function(response) {
                try
                {
                    var g = response.getReturnValue();
                    var state = response.getState();
                    
                    if(state==="SUCCESS" && (!($A.util.isUndefinedOrNull(g)))) {
                        
                        //set loan, credit, saving, networth, goals
                        component.set('v.saving', g.financialAccountList['0']);
                        component.set('v.credit', g.financialAccountList['1']);
                        component.set('v.loan', g.financialAccountList['2']);
                        var netWorth = g.balanceList['0'] - (g.balanceList['1'] + g.balanceList['2']);
                        component.set('v.netWorth', netWorth);
                        var cashvalue = g.balanceList['0'];
                        component.set('v.cashvalue', cashvalue);
                        var investmentvalue= g.balanceList['0'];
                        console.log('investmentvalue-----'+investmentvalue);
                        var creditvalue= g.balanceList['1'];
                        console.log('creditvalue-----'+creditvalue);
                        var loanvalue =g.balanceList['2'];
                        console.log('loanvalue-----'+loanvalue);
                        component.set('v.investmentvalue', investmentvalue);
                        component.set('v.creditvalue', creditvalue);
                        component.set('v.loanvalue', loanvalue);
                        
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
        var sav=event.getSource().get("v.value");
        component.set("v.CurrentOpening",2);
        component.set("v.isModalOpen","true");
    },
    handleAccount:function(component,event,helper){
        
        var eventSource= event.getSource();
        var txnId=eventSource.get("v.value");
        component.set("v.Tid",txnId);
        var cmpEvent = component.getEvent("rTid");
        cmpEvent.setParams( { "eTid" :  txnId} );
        cmpEvent.fire();
    },
    toggleSection : function(component, event, helper) {
        
        var sectionAuraId =event.getSource().get("v.name");;
        var sectionDiv = component.find(sectionAuraId);
        var sectionState =$A.util.hasClass(sectionDiv, 'slds-is-collapsed')
        if(sectionState){
            $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
            $A.util.addClass(sectionDiv, 'slds-is-expanded');
        }
        else{
            $A.util.removeClass(sectionDiv, 'slds-is-expanded');
            $A.util.addClass(sectionDiv, 'slds-is-collapsed');
        }
        if(sectionState){
            $A.util.removeClass(sectionDiv, 'slds-is-collapsed');
            $A.util.addClass(sectionDiv, 'slds-is-expanded');
            event.getSource().set("v.iconName",'utility:chevrondown');
            
        }
        else{
            $A.util.removeClass(sectionDiv, 'slds-is-expanded');
            $A.util.addClass(sectionDiv, 'slds-is-collapsed');
            event.getSource().set("v.iconName",'utility:chevronright');
            
        }
        
    },
    addnewaccount:function(component){
        component.set("v.showInModal",true);
    }
})